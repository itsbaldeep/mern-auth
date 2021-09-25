import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import PrivateRoute from "./components/routing/PrivateRoute";
import PrivateScreen from "./components/screens/PrivateScreen";
import LoginScreen from "./components/screens/LoginScreen";
import RegisterScreen from "./components/screens/RegisterScreen";
import ForgotPasswordScreen from "./components/screens/ForgotPasswordScreen";
import ResetPasswordScreen from "./components/screens/ResetPasswordScreen";

const App = () => {
    return (
        <Router>
            <div className="app">
                <Switch>
                    <PrivateRoute exact path="/" component={PrivateScreen} />
                    <Route exact path="/login" component={LoginScreen}></Route>
                    <Route exact path="/register" component={RegisterScreen}></Route>
                    <Route exact path="/forgotpassword" component={ForgotPasswordScreen}></Route>
                    <Route exact path="/resetpassword/:resetToken" component={ResetPasswordScreen}></Route>
                </Switch>
            </div>
        </Router>
    );
};

export default App;
