"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [tokenValidationResult, setTokenValidationResult] = useState<any>(null);
  const router = useRouter();
  const { token, user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated || !token) {
      router.push("/login");
      return;
    }

    const validateToken = () => {
      try {
        const parts = token.split('.');
        if (parts.length !== 3) {
          return {
            valid: false,
            error: `Token has ${parts.length} parts, expected 3`
          };
        }

        try {
          const payload = JSON.parse(atob(parts[1]));
          return {
            valid: true,
            details: {
              exp: payload.exp ? new Date(payload.exp * 1000).toISOString() : 'No expiration',
              sub: payload.sub || 'No subject',
              iat: payload.iat ? new Date(payload.iat * 1000).toISOString() : 'No issue time',
              aud: payload.aud || 'No audience'
            }
          };
        } catch (e) {
          return {
            valid: false,
            error: 'Failed to decode token payload'
          };
        }
      } catch (e) {
        return {
          valid: false,
          error: e instanceof Error ? e.message : 'Unknown token validation error'
        };
      }
    };
    
    setTokenValidationResult(validateToken());

    const testApi = async () => {
      try {
        const testResponse = await fetch("/api/test");
        const testData = await testResponse.json();
        console.log("API test response:", testData);
        
        fetchProfile();
      } catch (err) {
        console.error("API test failed:", err);
        setError("API endpoints are not responding. Please try again later.");
        setIsLoading(false);
      }
    };

    const fetchProfile = async () => {
      try {
        console.log("Fetching profile with token:", token.substring(0, 10) + "...");
        
        // Log full request details for debugging
        console.log("Request headers:", {
          Authorization: `Bearer ${token.substring(0, 10)}...`
        });
        
        // Try the alternate endpoint first - it only uses token auth
        console.log("Trying token-only endpoint first...");
        try {
          const tokenOnlyResponse = await fetch("/api/users/me-token", {
            headers: {
              "Authorization": `Bearer ${token}`,
            },
          });
          
          console.log("Token-only endpoint status:", tokenOnlyResponse.status);
          
          const tokenData = await tokenOnlyResponse.json();
          console.log("Token-only endpoint data:", tokenData);
          
          if (tokenOnlyResponse.ok) {
            console.log("Token-only endpoint successful");
            setProfile(tokenData);
            setApiResponse({
              endpoint: "token-only",
              status: tokenOnlyResponse.status,
              data: tokenData
            });
            setIsLoading(false);
            return;
          } else {
            console.log("Token-only endpoint failed, trying original endpoint...");
            setApiResponse({
              endpoint: "token-only",
              status: tokenOnlyResponse.status,
              error: tokenData.error,
              details: tokenData.details,
              data: tokenData
            });
          }
        } catch (tokenErr) {
          console.error("Token-only endpoint error:", tokenErr);
          setApiResponse({
            endpoint: "token-only",
            error: tokenErr instanceof Error ? tokenErr.message : "Unknown token endpoint error"
          });
        }
        
        // If token-only endpoint fails, try the original endpoint
        console.log("Falling back to original endpoint...");
        const response = await fetch("/api/users/me", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        // Log the raw response status and headers
        console.log("Original endpoint status:", response.status);
        console.log("Original endpoint status text:", response.statusText);
        
        // Try to get the data even if status is not 200
        let data;
        try {
          data = await response.json();
          console.log("Original endpoint data:", data);
          
          // Update API response with both endpoint results
          setApiResponse(prev => ({
            tokenEndpoint: prev,
            originalEndpoint: {
              status: response.status,
              data: data
            }
          }));
        } catch (parseError) {
          console.error("Failed to parse response:", parseError);
          // Update API response with both endpoint results
          setApiResponse(prev => ({
            tokenEndpoint: prev,
            originalEndpoint: {
              status: response.status,
              parseError: parseError instanceof Error ? parseError.message : 'Unknown parsing error',
            }
          }));
          data = { error: "Failed to parse response" };
        }

        if (!response.ok) {
          throw new Error(data?.error || `Server returned ${response.status}: ${response.statusText}`);
        }

        setProfile(data);
      } catch (err) {
        console.error("Profile fetch error:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    testApi();
  }, [token, router, user, isAuthenticated]);

  const showDebugInfo = () => {
    return (
      <div className="mt-8 p-4 bg-gray-100 rounded-lg text-xs overflow-auto">
        <h3 className="font-bold mb-2">Debug Information:</h3>
        <div className="space-y-2">
          <div>
            <p><strong>Authentication Status:</strong> {isAuthenticated ? "Authenticated" : "Not Authenticated"}</p>
            <p><strong>Token exists:</strong> {token ? "Yes" : "No"}</p>
            <p><strong>User exists:</strong> {user ? "Yes" : "No"}</p>
          </div>
          
          {token && (
            <div>
              <p><strong>Token Validation:</strong></p>
              <pre className="whitespace-pre-wrap bg-slate-800 text-green-400 p-2 rounded">
                {JSON.stringify(tokenValidationResult, null, 2)}
              </pre>
            </div>
          )}
          
          {apiResponse && (
            <div>
              <p><strong>API Response:</strong></p>
              <pre className="whitespace-pre-wrap bg-slate-800 text-green-400 p-2 rounded">
                {JSON.stringify(apiResponse, null, 2)}
              </pre>
            </div>
          )}
          
          {user && (
            <div>
              <p><strong>User Object:</strong></p>
              <pre className="whitespace-pre-wrap bg-slate-800 text-green-400 p-2 rounded">
                {JSON.stringify(user, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="text-red-600 text-center">
                <p>{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
              {showDebugInfo()}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">My Profile</h1>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-8">
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Account Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Name
                      </label>
                      <p className="text-lg">{profile?.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Email
                      </label>
                      <p className="text-lg">{profile?.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Member Since
                      </label>
                      <p className="text-lg">
                        {profile?.createdAt
                          ? new Date(profile.createdAt).toLocaleDateString()
                          : "-"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Account Type
                      </label>
                      <p className="text-lg capitalize">{profile?.role?.toLowerCase() || "-"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {showDebugInfo()}
          </div>
        </div>
      </div>
    </div>
  );
} 