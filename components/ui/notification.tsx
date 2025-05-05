"use client"

import { useState, useEffect } from "react"
import { X, CheckCircle, AlertCircle, Info } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

const notificationVariants = cva("fixed flex items-start gap-2 p-4 rounded-lg shadow-lg border w-full max-w-sm z-50", {
  variants: {
    variant: {
      default: "bg-white border-slate-200 text-slate-950",
      success: "bg-white border-l-4 border-l-green-500 text-slate-950",
      error: "bg-white border-l-4 border-l-red-500 text-slate-950",
      info: "bg-white border-l-4 border-l-blue-500 text-slate-950",
    },
    position: {
      topRight: "top-4 right-4",
      topLeft: "top-4 left-4",
      bottomRight: "bottom-4 right-4",
      bottomLeft: "bottom-4 left-4",
      center: "top-4 left-1/2 -translate-x-1/2",
    },
  },
  defaultVariants: {
    variant: "default",
    position: "topRight",
  },
})

export interface NotificationProps extends VariantProps<typeof notificationVariants> {
  title: string
  description?: string
  duration?: number
  onClose?: () => void
}

export function Notification({ title, description, variant, position, duration = 5000, onClose }: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      if (onClose) setTimeout(onClose, 300)
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const getIcon = () => {
    switch (variant) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />
      default:
        return null
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={cn(notificationVariants({ variant, position }))}
        >
          {getIcon()}
          <div className="flex-1">
            <h3 className="font-medium">{title}</h3>
            {description && <p className="text-sm text-slate-500">{description}</p>}
          </div>
          <button
            onClick={() => {
              setIsVisible(false)
              if (onClose) setTimeout(onClose, 300)
            }}
            className="text-slate-400 hover:text-slate-500"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function useNotification() {
  const [notifications, setNotifications] = useState<Array<NotificationProps & { id: string }>>([])

  const showNotification = (props: NotificationProps) => {
    const id = Math.random().toString(36).substring(2, 9)
    setNotifications((prev) => [...prev, { ...props, id }])
    return id
  }

  const closeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }

  const NotificationContainer = () => (
    <>
      {notifications.map((notification) => (
        <Notification key={notification.id} {...notification} onClose={() => closeNotification(notification.id)} />
      ))}
    </>
  )

  return {
    showNotification,
    closeNotification,
    NotificationContainer,
  }
}
