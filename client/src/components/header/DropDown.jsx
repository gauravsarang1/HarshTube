import { Button } from "../ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Moon, Sun, User, Settings, LogOut, Palette, Bell, Heart, History } from "lucide-react"
import { Link } from "react-router-dom"

const DropDown = ({ userData, handleTheme, handleLogout, handleSettings, handleProfile, handleLikedVideos, handleWatchHistory }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full shadow-md bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 hover:scale-105 transition-all duration-300">
          <Avatar className="h-8 w-8">
            <AvatarImage src={userData?.avatar} alt={userData?.fullName || "User"} />
            <AvatarFallback>{userData?.fullName?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60 rounded-2xl shadow-xl border-2 border-gray-100 dark:border-gray-800 bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-800 dark:to-gray-900/80 backdrop-blur-sm p-2" align="end" forceMount>
        <DropdownMenuLabel className="font-normal mb-2">
          <div className="flex flex-col space-y-1">
            <p className="text-base font-bold leading-none text-gray-900 dark:text-white">{userData?.fullName || "User"}</p>
            <p className="text-xs leading-none text-gray-500 dark:text-gray-400">
              {userData?.email || "user@example.com"}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={handleProfile} className="rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900 transition-all duration-200">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900 transition-all duration-200">
            <Bell className="mr-2 h-4 w-4" />
            <span>Notifications</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleSettings} className="rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900 transition-all duration-200">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link to="/liked-videos">
            <DropdownMenuItem onClick={handleLikedVideos} className="rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900 transition-all duration-200">
              <Heart className="mr-2 h-4 w-4" />
              <span>Liked Videos</span>
            </DropdownMenuItem>
          </Link>
          <Link to="/watch-history">
            <DropdownMenuItem onClick={handleWatchHistory} className="rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900 transition-all duration-200">
              <History className="mr-2 h-4 w-4" />
              <span>Watch History</span>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="text-red-600 focus:text-red-600 rounded-lg hover:bg-red-100 dark:hover:bg-red-900 transition-all duration-200"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default DropDown
