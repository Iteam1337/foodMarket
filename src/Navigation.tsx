// import * as React from 'react'
import React, { useState } from 'react'
import { Button } from 'react-native'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import TendersAndContracts from './components/TendersAndContracts'
import Login from './components/Login'
import Deals from './components/Deals'
import Deal from './components/Deal'
import Chat from './components/Chat'
import TenderRequests from './components/TenderRequests'
import TenderRequest from './components/TenderRequest'
import { createStackNavigator } from '@react-navigation/stack'

const SupplierNavigation = (Tab: any) => {
  return (
    <>
      <Tab.Screen
        name="TenderReuests"
        component={TenderRequestsNavigation}
        options={{
          tabBarLabel: 'Anbudsförfrågningar',
          tabBarIcon: (color: any) => (
            <MaterialCommunityIcons name="cart" color={color} size={20} />
          ),
        }}
      />
      <Tab.Screen
        name="Deals"
        component={DealsNavigation}
        options={{
          tabBarLabel: 'Erbjudna varor',
          tabBarIcon: (color: any) => (
            <MaterialCommunityIcons name="home" color={color} size={20} />
          ),
        }}
      />

      <Tab.Screen
        name="TendersAndContracts"
        component={TendersAndContracts}
        options={{
          tabBarLabel: 'Mina anbud',
          tabBarIcon: (color: any) => (
            <MaterialCommunityIcons name="lock" color={color} size={20} />
          ),
        }}
      />
      <Tab.Screen
        name="Chat"
        component={Chat}
        options={{
          tabBarLabel: 'Meddelanden',
          tabBarIcon: (color: any) => (
            <MaterialCommunityIcons name="forum" color={color} size={20} />
          ),
        }}
      />
    </>
  )
}

const BuyerNavigation = (Tab: any) => {
  return (
    <>
      <Tab.Screen
        name="Deals"
        component={DealsNavigation}
        options={{
          tabBarLabel: 'Erbjudna varor',
          tabBarIcon: (color: any) => (
            <MaterialCommunityIcons name="home" color={color} size={20} />
          ),
        }}
      />

      <Tab.Screen
        name="TenderReuests"
        component={TenderRequestsNavigation}
        options={{
          tabBarLabel: 'Anbudsförfrågningar',
          tabBarIcon: (color: any) => (
            <MaterialCommunityIcons name="cart" color={color} size={20} />
          ),
        }}
      />
      <Tab.Screen
        name="TendersAndContracts"
        component={TendersAndContracts}
        options={{
          tabBarLabel: 'Mina anbud',
          tabBarIcon: (color: any) => (
            <MaterialCommunityIcons name="lock" color={color} size={20} />
          ),
        }}
      />
      <Tab.Screen
        name="Chat"
        component={Chat}
        options={{
          tabBarLabel: 'Meddelanden',
          tabBarIcon: (color: any) => (
            <MaterialCommunityIcons name="forum" color={color} size={20} />
          ),
        }}
      />
    </>
  )
}

const DealsNavigation = () => {
  const Stack = createStackNavigator()

  return (
    <>
      <Stack.Navigator>
        <Stack.Screen
          name="ListDeals"
          options={{
            title: 'Erbjudanden',
          }}
          component={Deals}
        />
        <Stack.Screen
          name="Deal"
          options={{
            title: 'Erbjudande',
          }}
          component={Deal}
        />
      </Stack.Navigator>
    </>
  )
}

const TenderRequestsNavigation = () => {
  const Stack = createStackNavigator()

  return (
    <>
      <Stack.Navigator>
        <Stack.Screen
          name="ListTenderRequests"
          options={{
            title: 'Anbudsförfrågningar',
          }}
          component={TenderRequests}
        />
        <Stack.Screen
          name="TenderRequest"
          options={{
            title: 'Anbudsförfrågan',
          }}
          component={TenderRequest}
        />
      </Stack.Navigator>
    </>
  )
}

const Navigation = () => {
  const Tab = createMaterialBottomTabNavigator()

  const [user, setUser] = useState<string>('')

  return (
    <Tab.Navigator
      barStyle={{ backgroundColor: 'white' }}
      initialRouteName="Login"
    >
      {user == '' ? (
        <Tab.Screen
          name="Login"
          children={() => (
            <Login
              onLogin={({ userType }: { userType: string }) => {
                setUser(userType)
              }}
            />
          )}
          options={{
            tabBarLabel: 'Logga in',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="home" color={color} size={20} />
            ),
          }}
        />
      ) : null}
      {user == 'Supplier' ? SupplierNavigation(Tab) : null}
      {user == 'Buyer' ? BuyerNavigation(Tab) : null}
    </Tab.Navigator>
  )
}

export default Navigation
