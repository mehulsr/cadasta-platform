window.Parsley
  .addValidator('sanitize', function (value, requirement) {
    return !value.match(/.*[<>;\\\/].*/);
  }, 2)
  .addMessage('sanitize', gettext('Input can not contain < > ; \\ or /.'));
