// tests/middlewares/index.test.ts
import { isAuthenticated} from '../../middlewares';
import { getUserBySessionToken } from '../../db';

jest.mock('../../db', () => ({
  getUserBySessionToken: jest.fn(),
}));


describe('isAuthenticated Middleware', () => {
  const mockRequest = (sessionToken?: string) => ({
    headers: {
      authorization: sessionToken,
    },
  });

  const mockResponse = () => {
    const res = {} as any;
    res.sendStatus = jest.fn().mockReturnValue(res);
    return res;
  };

  const mockNext = jest.fn();

  it('debería devolver 403 si no hay token', async () => {
    const req = mockRequest();
    const res = mockResponse();

    await isAuthenticated(req as any, res as any, mockNext);

    expect(res.sendStatus).toHaveBeenCalledWith(403);
  });

  it('debería devolver 403 si el usuario no existe', async () => {
    (getUserBySessionToken as jest.Mock).mockResolvedValue(null);

    const req = mockRequest('valid-token');
    const res = mockResponse();

    await isAuthenticated(req as any, res as any, mockNext);

    expect(res.sendStatus).toHaveBeenCalledWith(403);
  });

  it('debería llamar a next si el usuario es válido', async () => {
    (getUserBySessionToken as jest.Mock).mockResolvedValue({ _id: 'user-id' });

    const req = mockRequest('valid-token');
    const res = mockResponse();

    await isAuthenticated(req as any, res as any, mockNext);

    expect((req as any).identity).toEqual({ _id: 'user-id' });
    expect(mockNext).toHaveBeenCalled();
  });

  it('debería devolver 400 si hay un error inesperado', async () => {
    (getUserBySessionToken as jest.Mock).mockRejectedValue(new Error('Unexpected error'));

    const req = mockRequest('valid-token');
    const res = mockResponse();

    await isAuthenticated(req as any, res as any, mockNext);

    expect(res.sendStatus).toHaveBeenCalledWith(400);
  });
});
