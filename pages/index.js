import React from 'react';
import Link from 'next/link';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-8">Welcome to the Quiz App!</h1>
      <Link href="/quiz">
        <div className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Start Quiz
        </div>
      </Link>
    </div>
  );
};

export default Home;
