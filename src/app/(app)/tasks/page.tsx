'use client';

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function TasksPage() {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Task Manager</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Here you will be able to manage your to-do list, add tasks, set priorities, and track your progress. This feature is coming soon!</p>
        </CardContent>
      </Card>
    </div>
  );
}
