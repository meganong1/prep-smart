import { Inter } from "next/font/google";
import "./page.module.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Prepsmart AI",
  description:
    "An AI interview coach that cares about your success as much as you do.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <GoogleOAuthProvider clientId={process.env.GOOGLE_AUTH_CLIENT_ID}>
        <body className={inter.className}>{children}</body>
      </GoogleOAuthProvider>
    </html>
  );
}
