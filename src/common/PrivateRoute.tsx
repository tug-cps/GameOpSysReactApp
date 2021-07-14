import * as React from 'react';
import {Redirect, Route, RouteProps,} from 'react-router-dom';
import {apiClient} from "./ApiClient";

interface Props {
    component: any
}

class PrivateRoute extends React.Component<Props & RouteProps> {
    render() {
        const {component: Component, ...rest} = this.props;
        const isSignedIn = apiClient.isLoggedIn;
        return (
            <Route
                {...rest}
                render={(routeProps) =>
                    isSignedIn ? (
                        <Component {...routeProps} />
                    ) : (
                        <Redirect
                            to={{
                                pathname: '/login',
                                state: {from: routeProps.location}
                            }}
                        />
                    )
                }
            />
        );
    }
}

export default PrivateRoute;