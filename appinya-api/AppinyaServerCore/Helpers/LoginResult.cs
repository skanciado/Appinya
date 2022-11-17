using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AppinyaServerCore.Helpers
{
    public class LoginResult : Microsoft.AspNetCore.Identity.SignInResult
    {
        public LoginResult() : base()
        {

        }
        public LoginResult(bool valid) : base()
        {
            this.Succeeded = valid;
            this.IsLockedOut = false;
            this.IsNotAllowed = false;
        }
    }
}
