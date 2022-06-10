exports.VerifyEmailHtml = (_user, _host) => {
  return `
    <h2> ${_user.name}! Thanks for signing up!</h2>
    <h4>Please verufy your mail to continue...</h4>
    <a href="http://${_host}/users/verify-email?token=${_user.emailToken}">Verify your email</a>    
    `;
};
