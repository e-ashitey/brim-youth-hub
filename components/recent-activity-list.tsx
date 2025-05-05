"use client"

import { formatDistanceToNow } from "date-fns"
import { Users, ClipboardEdit, Tent, UserPlus } from "lucide-react"

interface Activity {
  id: string
  type: "new_member" | "update_request" | "camp_registration"
  title: string
  description: string
  timestamp: string
}

interface RecentActivityListProps {
  activities: Activity[]
}

export function RecentActivityList({ activities }: RecentActivityListProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "new_member":
        return <UserPlus className="h-5 w-5 text-green-500" />
      case "update_request":
        return <ClipboardEdit className="h-5 w-5 text-blue-500" />
      case "camp_registration":
        return <Tent className="h-5 w-5 text-purple-500" />
      default:
        return <Users className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start space-x-3">
          <div className="mt-1">{getActivityIcon(activity.type)}</div>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium">{activity.title}</p>
            <p className="text-xs text-muted-foreground">{activity.description}</p>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

