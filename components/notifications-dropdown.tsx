"use client"

import { useState, useEffect } from "react"
import { Bell } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

interface Notification {
  id: number
  title: string
  message: string
  type: string
  is_read: boolean
  created_at: string
}

interface NotificationsDropdownProps {
  userId: number
}

export function NotificationsDropdown({ userId }: NotificationsDropdownProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/notifications?userId=${userId}`)
      const data = await response.json()
      if (response.ok) {
        setNotifications(data.notifications)
        setUnreadCount(data.notifications.filter((n: Notification) => !n.is_read).length)
      }
    } catch (error) {
      console.error("Error fetching notifications:", error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (notificationId: number) => {
    try {
      const response = await fetch("/api/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          notificationId,
        }),
      })

      if (response.ok) {
        setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n)))
        setUnreadCount((prev) => Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  useEffect(() => {
    if (userId) {
      fetchNotifications()
      // Poll for new notifications every 30 seconds
      const interval = setInterval(fetchNotifications, 30000)
      return () => clearInterval(interval)
    }
  }, [userId])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-600">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          Notifications
          {unreadCount > 0 && <Badge variant="secondary">{unreadCount} new</Badge>}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {loading ? (
          <DropdownMenuItem disabled>Loading notifications...</DropdownMenuItem>
        ) : notifications.length === 0 ? (
          <DropdownMenuItem disabled>No notifications</DropdownMenuItem>
        ) : (
          notifications.slice(0, 5).map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className={`flex flex-col items-start p-3 cursor-pointer ${!notification.is_read ? "bg-blue-50" : ""}`}
              onClick={() => !notification.is_read && markAsRead(notification.id)}
            >
              <div className="flex items-center justify-between w-full">
                <div className="font-medium text-sm">{notification.title}</div>
                {!notification.is_read && <div className="w-2 h-2 bg-blue-600 rounded-full" />}
              </div>
              <div className="text-xs text-muted-foreground mt-1 line-clamp-2">{notification.message}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {new Date(notification.created_at).toLocaleDateString()}
              </div>
            </DropdownMenuItem>
          ))
        )}
        {notifications.length > 5 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-center text-sm text-blue-600">View all notifications</DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
