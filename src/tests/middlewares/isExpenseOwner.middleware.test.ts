// tests/middlewares/index.test.ts
import { isExpenseOwner } from '../../middlewares';
import { getExpenseById } from '../../db';

jest.mock('../../db', () => ({
  getExpenseById: jest.fn(),
}));

describe('isExpenseOwner Middleware', () => {
  const mockRequest = (identity: any, params: any) => ({
    params,
    identity,
  });

  const mockResponse = () => {
    const res = {} as any;
    res.sendStatus = jest.fn().mockReturnValue(res);
    return res;
  };

  const mockNext = jest.fn();

  it('debería devolver 400 si no se encuentra la transacción', async () => {
    (getExpenseById as jest.Mock).mockResolvedValue(null);

    const req = mockRequest({ _id: 'user-id' }, { id: 'expense-id' });
    const res = mockResponse();

    await isExpenseOwner(req as any, res as any, mockNext);

    expect(res.sendStatus).toHaveBeenCalledWith(400);
  });

  it('debería devolver 403 si el usuario no es el propietario', async () => {
    (getExpenseById as jest.Mock).mockResolvedValue({ owner: { _id: 'different-user' } });

    const req = mockRequest({ _id: 'user-id' }, { id: 'expense-id' });
    const res = mockResponse();

    await isExpenseOwner(req as any, res as any, mockNext);

    expect(res.sendStatus).toHaveBeenCalledWith(403);
  });

  it('debería llamar a next si el usuario es el propietario', async () => {
    (getExpenseById as jest.Mock).mockResolvedValue({ owner: { _id: 'user-id' } });

    const req = mockRequest({ _id: 'user-id' }, { id: 'expense-id' });
    const res = mockResponse();

    await isExpenseOwner(req as any, res as any, mockNext);

    expect((req as any).body.expense).toEqual({ owner: { _id: 'user-id' } });
    expect(mockNext).toHaveBeenCalled();
  });
});
