import {expect} from 'chai';
import nock from 'nock';
import { applyMiddleware } from 'redux'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import Storage from '../utils/Storage';

import SETTINGS from '../../src/settings';
import history from '../../src/history';
import * as accountActions from '../../src/actions/account';
import * as messageActions from '../../src/actions/messages';


const middlewares = [ thunk ]
const mockStore = configureMockStore(middlewares)

describe('Actions: account', () => {
  beforeEach(() => {
    window.localStorage = new Storage();
    window.localStorage.setItem('auth_token', 's8yc8shch98s');
  });

  /* ********************************************************
   *
   * Login
   *
   * ********************************************************/

  it ('creates POST_LOGIN_SUCCESS', () => {
    const response = {
      username: 'John',
      email: 'john@beatles.uk'
    }
    const action = accountActions.postLoginSuccess(response);

    expect(action).to.deep.equal({
      type: accountActions.POST_LOGIN_SUCCESS,
      response
    })
  });

  it ('creates POST_LOGIN_SUCCESS when login was succesful', (done) => {
    const userCredentials = {
      username: 'John',
      password: '123455'
    }
    
    const response = { 
        username: 'John',
        email: 'john@beatles.uk',
        first_name: 'John',
        last_name: 'Lennon',
        token: '8qwihd8zds87hds78'
      };

    const processedResponse = {
      success: true,
      content: response
    }

    nock(SETTINGS.API_BASE)
      .post('/account/login/', userCredentials)
      .reply(200, response)

    nock(SETTINGS.API_BASE)
      .get('/account/me/')
      .reply(200, response)

    const expectedActions = [
      { type: messageActions.REQUEST_START },
      { type: accountActions.POST_LOGIN_SUCCESS, response: processedResponse },
      { type: messageActions.REQUEST_DONE },
      { type: messageActions.REQUEST_START },
      { type: accountActions.GET_USERINFO_SUCCESS, response: processedResponse },
      { type: messageActions.REQUEST_DONE }
    ]

    const store = mockStore({}, expectedActions, done);
    store.dispatch(accountActions.accountLogin(userCredentials))
  });


  /* ********************************************************
   *
   * Logout
   *
   * ********************************************************/

  it ('creates POST_LOGOUT_SUCCESS', () => {
    const response = {}
    const action = accountActions.postLogoutSuccess(response);

    expect(action).to.deep.equal({
      type: accountActions.POST_LOGOUT_SUCCESS,
      response
    })
  });

  it ('creates POST_LOGOUT_SUCCESS when logout was succesful', (done) => {
    window.localStorage = new Storage();
    window.localStorage.setItem('auth_token', '8937hds8yh8hsd')

    const processedResponse = {
      success: true,
      content: {}
    }

    nock(SETTINGS.API_BASE)
      .post('/account/logout/', {})
      .reply(200)

    const expectedActions = [
      { type: messageActions.REQUEST_START },
      { type: accountActions.POST_LOGOUT_SUCCESS, response: processedResponse },
      { type: messageActions.REQUEST_DONE }
    ]

    const store = mockStore({}, expectedActions, done);
    store.dispatch(accountActions.accountLogout({}))
  });


  /* ********************************************************
   *
   * Register
   *
   * ********************************************************/

  it ('creates POST_REGISTER_SUCCESS', () => {
    const response = {}
    const action = accountActions.postRegisterSuccess(response);

    expect(action).to.deep.equal({
      type: accountActions.POST_REGISTER_SUCCESS,
      response
    })
  });

  it ('creates POST_REGISTER_SUCCESS when registration was succesful', (done) => {
    const userCredentials = {
      username: 'John',
      email: 'john@beatles.uk',
      first_name: 'John',
      last_name: 'Lennon',
      password: '123456',
      password_repeat: '123456',
    }
    
    const response = { 
      username: 'John',
      email: 'john@beatles.uk',
      first_name: 'John',
      last_name: 'Lennon'
    };

    const processedResponse = {
      success: true,
      content: response
    }

    nock(SETTINGS.API_BASE)
      .post('/account/register/', userCredentials)
      .reply(201, response)

    const expectedActions = [
      { type: messageActions.REQUEST_START },
      { type: accountActions.POST_REGISTER_SUCCESS, response: processedResponse },
      { type: messageActions.REQUEST_DONE }
    ]

    const store = mockStore({}, expectedActions, done);
    store.dispatch(accountActions.accountRegister(userCredentials))

    done();
  });


  /* ********************************************************
   *
   * Get user info
   *
   * ********************************************************/

  it ('creates GET_USERINFO_SUCCESS', () => {
    const response = {
      username: 'John',
      email: 'john@beatles.uk',
      first_name: 'John',
      last_name: 'Lennon'
    }
    const action = accountActions.getUserInfoSuccess(response);

    expect(action).to.deep.equal({
      type: accountActions.GET_USERINFO_SUCCESS,
      response
    })
  });

  it ('creates GET_USERINFO_SUCCESS when profile update was succesful', (done) => {
    const response = {
      username: 'John',
      email: 'john@beatles.uk',
      first_name: 'John',
      last_name: 'Lennon'
    };

    const processedResponse = {
      success: true,
      content: response
    }

    nock(SETTINGS.API_BASE)
      .get('/account/me/')
      .reply(200, response)

    const expectedActions = [
      { type: messageActions.REQUEST_START },
      { type: accountActions.GET_USERINFO_SUCCESS, response: processedResponse },
      { type: messageActions.REQUEST_DONE }
    ]

    const store = mockStore({}, expectedActions, done);
    store.dispatch(accountActions.accountGetUserInfo());
  });


  /* ********************************************************
   *
   * Update profile
   *
   * ********************************************************/

  it ('creates POST_UPDATEPROFILE_SUCCESS', () => {
    const response = {
      username: 'John',
      email: 'john@beatles.uk',
      first_name: 'John',
      last_name: 'Lennon'
    }
    const action = accountActions.postUpdateProfileSuccess(response);

    expect(action).to.deep.equal({
      type: accountActions.POST_UPDATEPROFILE_SUCCESS,
      response
    })
  });

  it ('creates POST_UPDATEPROFILE_SUCCESS when profile update was succesful', (done) => {
    const userCredentials = {
      username: 'John',
      email: 'john@beatles.uk',
      first_name: 'John',
      last_name: 'Lennon',
    }
    
    const response = {
      username: 'John',
      email: 'john@beatles.uk',
      first_name: 'John',
      last_name: 'Lennon'
    };

    const processedResponse = {
      success: true,
      content: response
    }


    nock(SETTINGS.API_BASE)
      .put('/account/me/', userCredentials)
      .reply(200, response)

    const expectedActions = [
      { type: messageActions.REQUEST_START },
      { type: accountActions.POST_UPDATEPROFILE_SUCCESS, response: processedResponse },
      { type: messageActions.REQUEST_DONE }
    ]

    const store = mockStore({}, expectedActions, done);
    store.dispatch(accountActions.accountUpdateProfile(userCredentials));
  });


  /* ********************************************************
   *
   * Change password
   *
   * ********************************************************/

  it ('creates POST_CHANGEPASSWORD_SUCCESS', () => {
    const response = {}

    const action = accountActions.postChangePasswordSuccess(response);

    expect(action).to.deep.equal({
      type: accountActions.POST_CHANGEPASSWORD_SUCCESS,
      response
    })
  });

  it ('creates POST_CHANGEPASSWORD_SUCCESS when profile update was succesful', (done) => {
    const passwords = {
      new_password: "123456",
      re_new_password: "123456",
      current_password: "78910"
    }
    
    const response = {};

    const processedResponse = {
      success: true,
      content: response
    }


    nock(SETTINGS.API_BASE)
      .post('/account/password/', passwords)
      .reply(200, response)

    const expectedActions = [
      { type: messageActions.REQUEST_START },
      { type: accountActions.POST_CHANGEPASSWORD_SUCCESS, response: processedResponse },
      { type: messageActions.REQUEST_DONE }
    ]

    const store = mockStore({}, expectedActions, done);
    store.dispatch(accountActions.accountChangePassword(passwords));
  });

  /* ********************************************************
   *
   * Reset password
   *
   * ********************************************************/

  it ('creates POST_RESETPASSWORD_SUCCESS', () => {
    const response = {}

    const action = accountActions.postResetPasswordSuccess(response);

    expect(action).to.deep.equal({
      type: accountActions.POST_RESETPASSWORD_SUCCESS,
      response
    })
  });

  it ('creates POST_RESETPASSWORD_SUCCESS when password change was succesful', (done) => {
    const user = {
      email: 'john@beatles.uk'
    }
    
    const response = {};

    const processedResponse = {
      success: true,
      content: response
    }


    nock(SETTINGS.API_BASE)
      .post('/account/password/reset/', user)
      .reply(200, response)

    const expectedActions = [
      { type: messageActions.REQUEST_START },
      { type: accountActions.POST_RESETPASSWORD_SUCCESS, response: processedResponse },
      { type: messageActions.REQUEST_DONE }
    ]

    const store = mockStore({}, expectedActions, done);
    store.dispatch(accountActions.accountResetPassword(user));
  });

  /* ********************************************************
   *
   * Confirm reset password
   *
   * ********************************************************/

  it ('creates POST_RESETCONFIRMPASSWORD_SUCCESS', () => {
    const response = {}

    const action = accountActions.postResetConfirmPasswordSuccess(response);

    expect(action).to.deep.equal({
      type: accountActions.POST_RESETCONFIRMPASSWORD_SUCCESS,
      response
    })
  });

  it ('creates POST_RESETCONFIRMPASSWORD_SUCCESS when password reset was succesful', (done) => {
    const user = {
      uid: 'MQ',
      token: '489-963055ee7742ad6c4440',
      new_password: '123456',
      re_new_password: '123456'
    }
    
    const response = {};

    const processedResponse = {
      success: true,
      content: response
    }


    nock(SETTINGS.API_BASE)
      .post('/account/password/reset/confirm/', user)
      .reply(200, response)

    const expectedActions = [
      { type: messageActions.REQUEST_START },
      { type: accountActions.POST_RESETCONFIRMPASSWORD_SUCCESS, response: processedResponse },
      { type: messageActions.REQUEST_DONE }
    ]

    const store = mockStore({}, expectedActions, done);
    store.dispatch(accountActions.accountResetConfirmPassword(user));
  });

  /* ********************************************************
   *
   * Activate account
   *
   * ********************************************************/

  it ('creates POST_ACTIVATE_SUCCESS', () => {
    const response = {}

    const action = accountActions.postActivateSuccess(response);

    expect(action).to.deep.equal({
      type: accountActions.POST_ACTIVATE_SUCCESS,
      response
    })
  });

  it ('creates POST_ACTIVATE_SUCCESS when account activation was succesful', (done) => {
    const data = {
      uid: 'MQ',
      token: '489-963055ee7742ad6c4440',
    }
    
    const response = {};

    const processedResponse = {
      success: true,
      content: response
    }

    nock(SETTINGS.API_BASE)
      .post('/account/activate/', data)
      .reply(200, response)

    const expectedActions = [
      { type: messageActions.REQUEST_START },
      { type: accountActions.POST_ACTIVATE_SUCCESS, response: processedResponse },
      { type: messageActions.REQUEST_DONE }
    ]

    const store = mockStore({}, expectedActions, done);
    store.dispatch(accountActions.accountActivate(data));
    done();
  });
});