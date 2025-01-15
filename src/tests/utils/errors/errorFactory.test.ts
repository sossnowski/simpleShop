import { StatusCodes } from 'http-status-codes';
import { errorFactory } from 'utils/errors/errorFactory';

describe('errorFactory', () => {
  it('should create bad request error', () => {
    const errors = errorFactory();
    const badRequestError = errors.badRequestError();
    expect(badRequestError.status).toBe(StatusCodes.BAD_REQUEST);
    expect(badRequestError.message).toBe('Bad request error');

    const badRequestErrorWithMessage = errors.badRequestError('Custom bad request message');
    expect(badRequestErrorWithMessage.status).toBe(StatusCodes.BAD_REQUEST);
    expect(badRequestErrorWithMessage.message).toBe('Custom bad request message');
  });

  it('should create internal server error', () => {
    const errors = errorFactory();
    const internalServerError = errors.internalServerError();
    expect(internalServerError.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(internalServerError.message).toBe('Internal server error. Try later!');

    const internalServerErrorWithMessage = errors.internalServerError('Custom internal server error message');
    expect(internalServerErrorWithMessage.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(internalServerErrorWithMessage.message).toBe('Custom internal server error message');
  });

  it('should create not found error', () => {
    const errors = errorFactory();
    const notFoundError = errors.notFoundError();
    expect(notFoundError.status).toBe(StatusCodes.NOT_FOUND);
    expect(notFoundError.message).toBe('Not found error');

    const notFoundErrorWithMessage = errors.notFoundError('Custom not found error message');
    expect(notFoundErrorWithMessage.status).toBe(StatusCodes.NOT_FOUND);
    expect(notFoundErrorWithMessage.message).toBe('Custom not found error message');
  });
});
