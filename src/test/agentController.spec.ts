import { agentController } from '../modules/agent/agent.controller';
import { AgentService } from '../modules/agent/agent.service';
import { Request, Response } from 'express';

jest.mock('../modules/agent/agent.service');


beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  (console.log as jest.Mock).mockRestore();
  (console.error as jest.Mock).mockRestore();
});


const mockReq = (overrides: Partial<Request>): Request => ({
  user: { id: 'agent123' },
  ...overrides,
} as Request);

const mockRes = (): Response => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('agentController.getCommissionHistory', () => {
  it('should return commission history for valid agent', async () => {
    const req = mockReq({});
    const res = mockRes();
    const mockData = [{ loanId: 'loan1', commission: 120 }];

    (AgentService.getCommissionHistory as jest.Mock).mockResolvedValue(mockData);

const next = jest.fn();
    await agentController.getCommissionHistory(req, res, next);

    expect(AgentService.getCommissionHistory).toHaveBeenCalledWith('agent123');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true, data: mockData })
    );
  });

 it('should call next with error if user is missing', async () => {
  const req = { user: undefined } as Partial<Request> as Request;
  const res = mockRes();
  const next = jest.fn();

  await agentController.getCommissionHistory(req, res, next);

  expect(next).toHaveBeenCalledWith(expect.any(Error));
  expect((next as jest.Mock).mock.calls[0][0].message)
    .toBe('Unauthorized: User not found in request.');
});

});
