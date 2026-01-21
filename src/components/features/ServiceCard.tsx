'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export interface ServiceCardProps {
  title: string;
  description: string;
  icon: string;
  onClick?: () => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  description,
  icon,
  onClick,
}) => {
  return (
    <Card
      className="hover:shadow-lg transition-shadow cursor-pointer group"
      onClick={onClick}
    >
      <CardHeader>
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
          <i className={`${icon} text-primary text-2xl`}></i>
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          variant="ghost"
          className="w-full justify-start p-0 h-auto font-normal text-primary hover:text-primary/80"
        >
          Learn More
          <i className="lni lni-arrow-right ml-2"></i>
        </Button>
      </CardContent>
    </Card>
  );
};
