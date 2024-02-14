import { useNavigate } from "react-router-dom";
import SvgLogo from "./SvgLogo";

const Login = () => {
  let navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // handling login logic
    navigate("/home");
  };
  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
      }}
    >
      <div className="md:flex">
        <div className="grid h-full bg-[#f7f3f35e] md:h-screen md:w-3/5">
          <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
              <div className="flex justify-center">
                <SvgLogo height="200px" width="200px" transition={true} />
              </div>
              <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <div className="-space-y-px shadow-sm">
                  <div>
                    <label htmlFor="email-address" className="sr-only">
                      Email
                    </label>
                    <input
                      id="email-address"
                      name="email"
                      type="email"
                      autoComplete="email"
                      className="relative block w-full appearance-none rounded-none rounded-t-lg border border-blue-100 px-3 py-2 text-gray-500 placeholder-gray-400 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      placeholder="Email"
                    />
                  </div>
                  <br />
                  <div>
                    <label htmlFor="password" className="sr-only">
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      className="relative block w-full appearance-none rounded-none rounded-bl-lg border border-blue-100 px-3 py-2 text-gray-500 placeholder-gray-400 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      placeholder="Password"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-400 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label
                      htmlFor="remember-me"
                      className="ml-2 block text-sm text-gray-500"
                    >
                      Remember me
                    </label>
                  </div>
                  <div className="text-sm">
                    <a
                      href="#"
                      className="font-medium text-gray-500 hover:text-indigo-500"
                    >
                      (Having Trouble?)
                    </a>
                  </div>
                </div>
                <button
                  type="submit"
                  className="group relative flex w-full justify-center rounded-br-lg rounded-bl-lg border border-transparent bg-[#7085e5] py-2 px-4 text-sm font-medium text-white hover:bg-[#8070d0] focus:outline-none focus:ring-2 focus:ring-[#6D5ACF] focus:ring-offset-2"
                >
                  Login
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className="invisible bg-gray-300 md:visible md:w-1/2 md:h-full">
          <img
            src="https://source.unsplash.com/random/?random"
            alt="Random images"
            className="h-screen w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
