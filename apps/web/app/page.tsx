'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';



import LandingPage from '@/components/LandingPage'

export default function Home() {
  return <LandingPage />;
}
