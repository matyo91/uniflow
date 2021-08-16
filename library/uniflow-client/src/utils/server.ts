import env from './env';

export default {
  getBaseUrl: () => {
    return env.get('apiUrl');
  },
  handleErrors: (response) => {
    const errors = {};

    if (response.data.validation) {
      for (const item of response.data.validation) {
        errors[item.key] = errors[item.key] || [];
        for (const message of item.messages) {
          errors[item.key].push(message);
        }
      }
    }

    return errors;
  },
};
