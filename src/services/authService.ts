import { logger, errorToLogContext } from '../lib/logger';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'user' | 'admin' | 'moderator';
  permissions: string[];
  lastLogin: Date;
  createdAt: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export class AuthService {
  private baseUrl: string;
  private clientId: string;
  private redirectUri: string;

  constructor() {
    this.baseUrl = process.env['NEXT_PUBLIC_AUTH_BASE_URL'] || 'https://auth.durgasos.com';
    this.clientId = process.env['NEXT_PUBLIC_AUTH_CLIENT_ID'] || 'durgasos-client';
    this.redirectUri = process.env['NEXT_PUBLIC_AUTH_REDIRECT_URI'] || `${window.location.origin}/auth/callback`;
  }

  async loginWithEmail(credentials: LoginCredentials): Promise<User> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const data = await response.json();
      this.setToken(data.token);
      return data.user;
    } catch (error) {
      logger.error('Login error:', errorToLogContext(error));
      throw error;
    }
  }

  async register(data: RegisterData): Promise<User> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
      }

      const result = await response.json();
      this.setToken(result.token);
      return result.user;
    } catch (error) {
      logger.error('Registration error:', errorToLogContext(error));
      throw error;
    }
  }

  async loginWithGoogle(): Promise<void> {
    const authUrl = new URL(`${this.baseUrl}/oauth/google`);
    authUrl.searchParams.set('client_id', this.clientId);
    authUrl.searchParams.set('redirect_uri', this.redirectUri);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', 'openid email profile');
    authUrl.searchParams.set('state', this.generateState());

    window.location.href = authUrl.toString();
  }

  async loginWithMicrosoft(): Promise<void> {
    const authUrl = new URL(`${this.baseUrl}/oauth/microsoft`);
    authUrl.searchParams.set('client_id', this.clientId);
    authUrl.searchParams.set('redirect_uri', this.redirectUri);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', 'openid email profile');
    authUrl.searchParams.set('state', this.generateState());

    window.location.href = authUrl.toString();
  }

  async loginWithGitHub(): Promise<void> {
    const authUrl = new URL(`${this.baseUrl}/oauth/github`);
    authUrl.searchParams.set('client_id', this.clientId);
    authUrl.searchParams.set('redirect_uri', this.redirectUri);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', 'user:email');
    authUrl.searchParams.set('state', this.generateState());

    window.location.href = authUrl.toString();
  }

  async handleOAuthCallback(code: string, state: string): Promise<User> {
    try {
      const response = await fetch(`${this.baseUrl}/oauth/callback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, state }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'OAuth callback failed');
      }

      const data = await response.json();
      this.setToken(data.token);
      return data.user;
    } catch (error) {
      logger.error('OAuth callback error:', errorToLogContext(error));
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      const token = this.getToken();
      if (token) {
        await fetch(`${this.baseUrl}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      logger.error('Logout error:', errorToLogContext(error));
    } finally {
      this.clearToken();
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const token = this.getToken();
      if (!token) return null;

      const response = await fetch(`${this.baseUrl}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        this.clearToken();
        return null;
      }

      const user = await response.json();
      return user;
    } catch (error) {
      logger.error('Get current user error:', errorToLogContext(error));
      return null;
    }
  }

  async refreshToken(): Promise<string | null> {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) return null;

      const response = await fetch(`${this.baseUrl}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (!response.ok) {
        this.clearToken();
        return null;
      }

      const data = await response.json();
      this.setToken(data.token);
      return data.token;
    } catch (error) {
      logger.error('Token refresh error:', errorToLogContext(error));
      return null;
    }
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      const token = this.getToken();
      if (!token) throw new Error('Not authenticated');

      const response = await fetch(`${this.baseUrl}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Password change failed');
      }
    } catch (error) {
      logger.error('Change password error:', errorToLogContext(error));
      throw error;
    }
  }

  async resetPassword(email: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Password reset failed');
      }
    } catch (error) {
      logger.error('Reset password error:', errorToLogContext(error));
      throw error;
    }
  }

  async enable2FA(): Promise<{ qrCode: string; secret: string }> {
    try {
      const token = this.getToken();
      if (!token) throw new Error('Not authenticated');

      const response = await fetch(`${this.baseUrl}/auth/2fa/enable`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || '2FA enable failed');
      }

      return await response.json();
    } catch (error) {
      logger.error('Enable 2FA error:', errorToLogContext(error));
      throw error;
    }
  }

  async verify2FA(code: string): Promise<void> {
    try {
      const token = this.getToken();
      if (!token) throw new Error('Not authenticated');

      const response = await fetch(`${this.baseUrl}/auth/2fa/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || '2FA verification failed');
      }
    } catch (error) {
      logger.error('Verify 2FA error:', errorToLogContext(error));
      throw error;
    }
  }

  private setToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('auth_token', token);
  }

  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  }

  private getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('refresh_token');
  }

  private clearToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
  }

  private generateState(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

// Singleton instance
export const authService = new AuthService();
