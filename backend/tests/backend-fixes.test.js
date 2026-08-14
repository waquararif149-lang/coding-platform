import test from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';

import authenticate from '../middlewares/auth.middleware.js';
import executionService from '../modules/execution/execution.service.js';
import testCaseRepository from '../modules/testcase/testcase.repository.js';

process.env.JWT_SECRET = 'test-secret';

test('auth middleware returns a session-expired message for expired tokens', () => {
  const expiredToken = jwt.sign(
    { userId: '64c0d1f2e3fabc1234567890', role: 'STUDENT' },
    process.env.JWT_SECRET,
    { expiresIn: '-1s' }
  );

  const req = {
    headers: { authorization: `Bearer ${expiredToken}` }
  };

  let statusCode = null;
  let responseBody = null;

  const res = {
    status(code) {
      statusCode = code;
      return this;
    },
    json(payload) {
      responseBody = payload;
      return this;
    }
  };

  authenticate(req, res, () => {});

  assert.equal(statusCode, 401);
  assert.equal(responseBody.message, 'Your session has expired. Please log in again.');
});

test('execution service evaluates each testcase individually and reports all results', async () => {
  const originalFind = testCaseRepository.findTestCasesByQuestionId;
  const originalExecute = executionService.executeCode;

  try {
    testCaseRepository.findTestCasesByQuestionId = async () => [
      { _id: '1', input: '2\n', expectedOutput: '4\n', isHidden: false },
      { _id: '2', input: '3\n', expectedOutput: '9\n', isHidden: false }
    ];

    const calls = [];
    executionService.executeCode = async ({ stdin }) => {
      calls.push(stdin);

      if (stdin === '2\n') {
        return { stdout: '4\n', stderr: '', exception: null };
      }

      if (stdin === '3\n') {
        return { stdout: '10\n', stderr: '', exception: null };
      }

      return { stdout: '', stderr: '', exception: null };
    };

    const result = await executionService.executeQuestion({
      questionId: '64c0d1f2e3fabc1234567890',
      language: 'python',
      code: 'print(2**2)'
    });

    assert.deepEqual(calls, ['2\n', '3\n']);
    assert.equal(result.totalTests, 2);
    assert.equal(result.passedTests, 1);
    assert.equal(result.status, 'WRONG_ANSWER');
    assert.equal(result.results[1].status, 'WRONG_ANSWER');
  } finally {
    testCaseRepository.findTestCasesByQuestionId = originalFind;
    executionService.executeCode = originalExecute;
  }
});
