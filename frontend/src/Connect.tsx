import { useEffect } from 'react';
import { useMoralis } from "react-moralis";
import {Button, View} from 'react-native';


function Connect() {
    const { authenticate, isAuthenticated, isAuthenticating, user, account, logout } = useMoralis();

    useEffect(() => {
    if (isAuthenticated) {
      // add your logic here
    }
  }, [isAuthenticated]);

    const login = async () => {
      if (!isAuthenticated) {

        await authenticate({signingMessage: "Log in using Moralis" })
          .then(function (user) {
            console.log("logged in user:", user);
            console.log(user!.get("ethAddress"));
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    }

    const logOut = async () => {
      await logout();
      console.log("logged out");
    }

    return (
      <div className='Connect-btn'>
        <View >
        <Button onPress={login} title="Connect" color="#02882f"
        accessibilityLabel="Learn more about this green button"/>
        <Button onPress={logOut} title="Disconnect" color="#c32d19"
        accessibilityLabel="Learn more about this green button"/>
        </View>
  
      </div>
    );
}

export default Connect;

//
//