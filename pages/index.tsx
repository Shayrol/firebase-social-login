import { useEffect, useState } from "react";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  UserCredential,
  User,
} from "firebase/auth";
import {
  auth,
  GoogleProvider,
  GithubProvider,
} from "@/src/commons/firebaseConfig";

const Home = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // 로딩 상태 추가

  // 로그인 함수
  const handleGoogleLogin = async () => {
    try {
      const result: UserCredential = await signInWithPopup(
        auth,
        GoogleProvider
      );
      setUser(result.user);
    } catch (error) {
      console.error("Error during sign in:", error);
    }
  };

  const handleGithubLogin = async () => {
    try {
      const result: UserCredential = await signInWithPopup(
        auth,
        GithubProvider
      );
      setUser(result.user);
    } catch (error) {
      console.error("Error during sign in:", error);
    }
  };

  console.log("user: ", user);

  // 로그아웃 함수
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Error during sign out:", error);
    }
  };

  // 사용자 상태 확인
  useEffect(() => {
    // onAuthStateChanged(로그인 상태 감지) - 로그인 or 로그아웃 실시간 감지
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false); // 로그인 상태 확인 후 로딩 완료
    });

    return () => unsubscribe(); // 메모리 누수 방지
  }, []);

  if (loading) {
    return <div>Loading...</div>; // 로그인 상태 확인 중일 때 로딩 표시
  }

  return (
    <div>
      <h1>Firebase Google Login or Github Login</h1>
      {user ? (
        <div>
          <p>Welcome, {user.displayName ?? user.email}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <>
          <button onClick={handleGoogleLogin}>Login with Google</button>
          <button onClick={handleGithubLogin}>Login with Github</button>
        </>
      )}
    </div>
  );
};

export default Home;
