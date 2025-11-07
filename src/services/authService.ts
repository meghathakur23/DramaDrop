/**
 * Mock authentication service
 * Replace with real API calls when backend is ready
 */

export interface SendOTPResponse {
  success: boolean;
  message?: string;
}

export interface VerifyOTPResponse {
  success: boolean;
  message?: string;
  token?: string;
}

/**
 * Mock function to send OTP
 * In production, this would call your backend API
 */
export const sendOTP = async (phoneNumber: string): Promise<SendOTPResponse> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Mock: Always return success
  // In production, this would validate phone number and send real OTP
  console.log(`[Mock] OTP sent to ${phoneNumber}`);
  console.log(`[Mock] Use OTP: 123456 for testing`);

  return {
    success: true,
    message: 'OTP sent successfully',
  };
};

/**
 * Mock function to verify OTP
 * In production, this would call your backend API
 * @param phoneNumber - The phone number to verify
 * @param otp - The OTP code entered by user
 */
export const verifyOTP = async (
  phoneNumber: string,
  otp: string,
): Promise<VerifyOTPResponse> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Mock: Accept OTP "123456" for testing
  // In production, this would verify against backend
  if (otp === '123456') {
    return {
      success: true,
      message: 'OTP verified successfully',
      token: `mock_token_${Date.now()}`,
    };
  }

  return {
    success: false,
    message: 'Invalid OTP. Please try again.',
  };
};
