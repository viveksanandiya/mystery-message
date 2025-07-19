import * as React from 'react';

interface EmailTemplateProps {
  username: string;
  otp: string;
}

export default function VerificationEmailTemplate({ username, otp }: EmailTemplateProps) {
  return (
    <div>
      <div>
        <h1>Welcome, {username}!</h1>
      </div>
      <div>
        <h2>Enter the verification code : {otp}</h2>
      </div>
      
    </div>
  );
}