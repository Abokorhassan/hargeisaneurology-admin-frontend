import React, { Component } from "react";
import { Row, Card, CardTitle, Label, FormGroup, Button } from "reactstrap";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { registerUser } from "../../redux/actions";

import { NotificationManager } from "../../components/common/react-notifications";
import { Formik, Form, Field } from "formik";

import IntlMessages from "../../helpers/IntlMessages";
import { Colxx } from "../../components/common/CustomBootstrap";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      first_name: "",
      second_name: "",
      role: ""
    };
  }

  // FIRING REGISTER
  onUserRegister = values => {
    if (!this.props.loading) {
      if (
        values.email !== "" &&
        values.password !== "" &&
        values.first_name !== "" &&
        values.second_name !== ""
      ) {
        this.props.registerUser(values, this.props.history);
        // this.props.history.push("/");
      }
    }
  };

  validateName = value => {
    let error;
    if (!value) {
      error = "Please enter a name";
    }
    return error;
  };

  validateEmail = value => {
    let error;
    if (!value) {
      error = "Please enter your email address";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
      error = "Invalid email address";
    }
    return error;
  };

  validatePassword = value => {
    let error;
    if (!value) {
      error = "Please enter your password";
    } else if (value.length < 4) {
      error = "Value must be longer than 3 characters";
    }
    return error;
  };

  // WARNING WITH THE UPDATES
  componentDidUpdate() {
    if (this.props.error) {
      NotificationManager.warning(
        this.props.error,
        "Register Error",
        3000,
        null,
        null,
        ""
      );
    }
  }

  render() {
    const { password, email, first_name, second_name, role } = this.state;
    const initialValues = { email, password, first_name, second_name, role };

    return (
      <Row className="h-100">
        <Colxx xxs="12" md="10" className="mx-auto my-auto">
          <Card className="auth-card">
            <div className="position-relative image-side ">
              <p className="text-white h2">MAGIC IS IN THE DETAILS</p>
              <p className="white mb-0">
                Please use this form to register. <br />
                If you are a member, please{" "}
                <NavLink to={`/user/login`} className="white">
                  login
                </NavLink>
                .
              </p>
            </div>
            <div className="form-side">
              <NavLink to={`/`} className="white">
                <span className="logo-single" />
              </NavLink>
              <CardTitle className="mb-4">
                <IntlMessages id="user.register" />
              </CardTitle>

              {
                // FORM USING FORMIK REACT
              }
              <Formik
                initialValues={initialValues}
                onSubmit={this.onUserRegister}
              >
                {({ errors, touched }) => (
                  <Form>
                    {
                      // FIRST NAME
                    }
                    <FormGroup className="form-group has-float-label">
                      <Label>
                        <IntlMessages id="user.first_name" />
                      </Label>
                      <Field
                        className="form-control"
                        name="first_name"
                        validate={this.validateName}
                      />
                      {errors.first_name && touched.first_name && (
                        <div className="invalid-feedback d-block">
                          {errors.first_name}
                        </div>
                      )}
                    </FormGroup>
                    {
                      // SECOND NAME
                    }
                    <FormGroup className="form-group has-float-label">
                      <Label>
                        <IntlMessages id="user.second_name" />
                      </Label>
                      <Field
                        className="form-control"
                        name="second_name"
                        validate={this.validateName}
                      />
                      {errors.second_name && touched.second_name && (
                        <div className="invalid-feedback d-block">
                          {errors.second_name}
                        </div>
                      )}
                    </FormGroup>
                    {
                      // EMAIL
                    }
                    <FormGroup className="form-group has-float-label">
                      <Label>
                        <IntlMessages id="user.email" />
                      </Label>
                      <Field
                        className="form-control"
                        name="email"
                        validate={this.validateEmail}
                      />
                      {errors.email && touched.email && (
                        <div className="invalid-feedback d-block">
                          {errors.email}
                        </div>
                      )}
                    </FormGroup>
                    {
                      // PASSWORD
                    }
                    <FormGroup className="form-group has-float-label">
                      <Label>
                        <IntlMessages id="user.password" />
                      </Label>
                      <Field
                        className="form-control"
                        type="password"
                        name="password"
                        validate={this.validatePassword}
                      />
                      {errors.password && touched.password && (
                        <div className="invalid-feedback d-block">
                          {errors.password}
                        </div>
                      )}
                    </FormGroup>

                    <div className="d-flex justify-content-between align-items-center">
                      <Button
                        color="primary"
                        className={`btn-shadow btn-multiple-state ${
                          this.props.loading ? "show-spinner" : ""
                        }`}
                        size="lg"
                      >
                        <span className="spinner d-inline-block">
                          <span className="bounce1" />
                          <span className="bounce2" />
                          <span className="bounce3" />
                        </span>
                        <span className="label">
                          <IntlMessages id="user.register-button" />
                        </span>
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </Card>
        </Colxx>
      </Row>
    );
  }
}
const mapStateToProps = ({ authUser }) => {
  const { user, loading } = authUser;
  return { user, loading };
};

export default connect(mapStateToProps, {
  registerUser
})(Register);
