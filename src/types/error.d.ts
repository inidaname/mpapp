interface AcctError {
  message: string;
  code: string;
  errors: {
    location: string;
    key: {
      'address.country': string;
    };
  };
}
