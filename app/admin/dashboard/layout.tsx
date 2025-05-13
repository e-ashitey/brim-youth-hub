"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Users, ClipboardEdit, Tent, Settings, Menu, X, Moon, Sun, LogOut } from "lucide-react"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"
import { useNotification } from "@/components/ui/notification"
import { supabaseBrowserClient as supabase } from "@/lib/supabase/client"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const { NotificationContainer } = useNotification()
  const [isMounted, setIsMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleLogout = async () => {
    setIsLoading(true)
    await supabase.auth.signOut()
    router.push('/admin')
    setIsLoading(false)
    // router.refresh()
  }

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Members", href: "/admin/members", icon: Users },
    { name: "Update Requests", href: "/admin/update-requests", icon: ClipboardEdit },
    { name: "Camp Registrations", href: "/admin/camp-registrations", icon: Tent },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Mobile menu button */}
        <div className="lg:hidden fixed top-4 left-4 z-50">
          <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 dark:text-gray-300"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile sidebar */}
        <AnimatePresence>
          {isMobileMenuOpen && (
              <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ duration: 0.3 }}
                  className="fixed inset-0 z-40 lg:hidden"
              >
                <div className="fixed inset-0 bg-black/50" onClick={closeMobileMenu} />
                <div className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-lg">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center space-x-2">
                        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                          B
                        </div>
                        <span className="text-lg font-semibold">BRIM</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {/* <LogoutButton /> */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden"
                            onClick={closeMobileMenu}
                        >
                          <LogOut className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                    <nav className="flex-1 px-2 py-4 space-y-1">
                      {navigation.map((item) => (
                          <Link
                              key={item.name}
                              href={item.href}
                              onClick={closeMobileMenu}
                              className={cn(
                                  pathname === item.href
                                      ? "bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400"
                                      : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700",
                                  "group flex items-center px-2 py-2 text-base font-medium rounded-md",
                              )}
                          >
                            <item.icon
                                className={cn(
                                    pathname === item.href
                                        ? "text-orange-500 dark:text-orange-400"
                                        : "text-gray-400 dark:text-gray-500",
                                    "mr-3 h-5 w-5",
                                )}
                            />
                            {item.name}
                          </Link>
                      ))}
                    </nav>
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                      <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => {
                            // Handle logout
                            handleLogout()
                          }}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
          )}
        </AnimatePresence>

        {/* Desktop sidebar */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
          <div className="flex flex-col flex-grow bg-white dark:bg-gray-800 shadow">
            <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200 dark:border-gray-700">
              <div className="relative h-10 w-10 mr-2">
                {/* <Image src="/logo.png" alt="Logo" fill className="object-contain" /> */}
              </div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
            </div>
            <div className="flex flex-col flex-grow">
              <nav className="flex-1 px-2 py-4 space-y-1">
                {navigation.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className={cn(
                            pathname === item.href
                                ? "bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400"
                                : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700",
                            "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
                        )}
                    >
                      <item.icon
                          className={cn(
                              pathname === item.href
                                  ? "text-orange-500 dark:text-orange-400"
                                  : "text-gray-400 dark:text-gray-500",
                              "mr-3 h-5 w-5",
                          )}
                      />
                      {item.name}
                    </Link>
                ))}
              </nav>
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <Button variant="outline" size="sm" className="w-full justify-start" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="lg:pl-64">
          <div className="sticky top-0 z-10 flex items-center justify-between h-16 bg-white dark:bg-gray-800 shadow-sm px-4 md:px-6">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white lg:hidden">Admin Dashboard</h1>
            <div className="flex items-center space-x-4 ml-auto">
              {isMounted && (
                  <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                      className="text-gray-700 dark:text-gray-300"
                  >
                    {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                  </Button>
              )}
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center text-white">A</div>
                <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300 hidden md:inline-block">
                Admin User
              </span>
              </div>
            </div>
          </div>
          <main className="p-4 md:p-6 lg:p-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              {children}
            </motion.div>
          </main>
        </div>
        <NotificationContainer />
      </div>
  )
}
