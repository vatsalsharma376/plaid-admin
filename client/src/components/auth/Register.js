import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { registerUser } from "../../actions/authActions";
import classnames from "classnames";

class Register extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      password: "",
      password2: "",
      errors: {}
    };
  }

  componentDidMount() {
    // If logged in and user navigates to Register page, should redirect them to dashboard
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dash");
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      });
    }
  }

  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();

    const newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2
    };

    this.props.registerUser(newUser, this.props.history);
  };

  render() {
    const { errors } = this.state;

    return (
      <div className="container flex h-screen">
        <div className="row max-w-xs w-full m-auto bg-indigo-100 rounded p-5">
          <div className="col s8 offset-s2">
            <Link to="/" className="btn-flat waves-effect">
              <i className="material-icons left">keyboard_backspace</i> Back
            </Link>
            <br/><br/>
            <div className="text-xl">
              <h4>
                <b>Register</b> 
              </h4>
              
            </div>
            <br/>
            <form noValidate onSubmit={this.onSubmit}>
              <div className="input-field col s12">
                <label htmlFor="name" className="block mb-2 text-indigo-500">Name</label>

                <input
                  onChange={this.onChange}
                  value={this.state.name}
                  error={errors.name}
                  id="name"
                  type="text"
                  className={classnames("w-full p-2 mb-6 text-indigo-700 border-b-2 border-indigo-500 outline-none focus:bg-gray-300", {
                    invalid: errors.name
                  })}
                />
                <span className="text-red-600">{errors.name}</span>
              </div>
              <div className="input-field col s12">
                <label htmlFor="email" className="block mb-2 text-indigo-500">Email</label>

                <input
                  onChange={this.onChange}
                  value={this.state.email}
                  error={errors.email}
                  id="email"
                  type="email"
                  className={classnames("w-full p-2 mb-6 text-indigo-700 border-b-2 border-indigo-500 outline-none focus:bg-gray-300", {
                    invalid: errors.email
                  })}
                />
                <span className="text-red-600">{errors.email}</span>
              </div>
              <div className="input-field col s12">
                <label htmlFor="password" className="block mb-2 text-indigo-500">Password</label>

                <input
                  onChange={this.onChange}
                  value={this.state.password}
                  error={errors.password}
                  id="password"
                  type="password"
                  className={classnames("w-full p-2 mb-6 text-indigo-700 border-b-2 border-indigo-500 outline-none focus:bg-gray-300", {
                    invalid: errors.password
                  })}
                />
                <span className="text-red-600">{errors.password}</span>
              </div>
              <div className="input-field col s12">
                <label htmlFor="password2" className="block mb-2 text-indigo-500">Confirm Password</label>

                <input
                  onChange={this.onChange}
                  value={this.state.password2}
                  error={errors.password2}
                  id="password2"
                  type="password"
                  className={classnames("w-full p-2 mb-1 text-indigo-700 border-b-2 border-indigo-500 outline-none focus:bg-gray-300", {
                    invalid: errors.password2
                  })}
                />
                <span className="text-red-600">{errors.password2}</span>
              </div>
              <div className="col" style={{ paddingLeft: "11.250px" }}>
                <button
                  style={{
                    width: "150px",
                    borderRadius: "3px",
                    letterSpacing: "1.5px",
                    marginTop: "1rem"
                  }}
                  type="submit"
                  className="w-full bg-indigo-700 hover:bg-pink-700 text-white font-bold py-2 px-4 mb-1 rounded"
                >
                  Sign up
                </button>
              </div>
              <p className="grey-text text-darken-1">
                Already have an account? <Link to="/login" className="text-indigo-700 hover:text-pink-700 text-lg">Log in</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { registerUser }
)(withRouter(Register));
