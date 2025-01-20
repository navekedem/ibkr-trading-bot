import { Button, Flex } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import IBKR from '../assets/IBKR.png';
import loginBG from '../assets/login-bg.jpg';

export const LoginPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Flex color="white" style={{ height: '100vh' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                <div style={{ display: 'flex', textAlign: 'center', color: '#000', flexDirection: 'column', padding: '0 5rem' }}>
                    <img src={IBKR} style={{ height: 200, width: 200, objectFit: 'contain', margin: 'auto' }}></img>
                    <h1 style={{ margin: '1rem 0', lineHeight: 1.2 }}>Welcome to Interactive Brokers Trading Bot</h1>
                    <div style={{ fontSize: '1.3rem' }}>
                        Before you are login into the system, Download the TWS desktop app and login to your interactive brokers account
                    </div>
                    <Button type="primary" style={{ width: '20%', margin: '1rem auto', fontWeight: 'bold' }} onClick={() => navigate('/Home')}>
                        Login
                    </Button>
                </div>
            </div>
            <div
                style={{ flex: 1, backgroundImage: `url(${loginBG})`, backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}
            ></div>
        </Flex>
    );
};
