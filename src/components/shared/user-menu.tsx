'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LogOut, User, GraduationCap, Settings, BookOpen, Heart, Sparkles, LayoutDashboard } from 'lucide-react'
import { toast } from 'sonner'

import { createClient } from '@/lib/supabase/client'
import { ROUTES } from '@/lib/constants'
import type { Profile } from '@/types/database'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface UserMenuProps {
  profile: Profile
}

export function UserMenu({ profile }: UserMenuProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error('Erreur lors de la déconnexion')
      return
    }
    toast.success('Déconnecté avec succès')
    router.push('/')
    router.refresh()
  }

  const initials = (profile.full_name || profile.email)
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const isInstructor = profile.role === 'INSTRUCTOR' || profile.role === 'ADMIN'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="rounded-full transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:ring-offset-2 focus:ring-offset-background">
          <Avatar size="md" ring="emerald">
            {profile.avatar_url && <AvatarImage src={profile.avatar_url} alt={profile.full_name || 'User'} />}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        <div className="px-3 py-2.5">
          <div className="flex items-center gap-3">
            <Avatar size="md" ring="emerald">
              {profile.avatar_url && <AvatarImage src={profile.avatar_url} alt={profile.full_name || ''} />}
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">
                {profile.full_name || 'Utilisateur'}
              </p>
              <p className="text-xs text-muted-foreground truncate">{profile.email}</p>
            </div>
          </div>

          {isInstructor && (
            <Badge variant="gradient" size="sm" className="mt-3" icon={<Sparkles className="h-3 w-3" />}>
              Formateur
            </Badge>
          )}
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuLabel>Mon espace</DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Link href={ROUTES.dashboard.student}>
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={ROUTES.dashboard.learning}>
            <BookOpen className="h-4 w-4" />
            Mes cours
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={ROUTES.dashboard.wishlist}>
            <Heart className="h-4 w-4" />
            Wishlist
          </Link>
        </DropdownMenuItem>

        {isInstructor && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Espace formateur</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={ROUTES.instructor.dashboard}>
                <GraduationCap className="h-4 w-4" />
                Studio formateur
              </Link>
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href={profile.username ? ROUTES.instructor(profile.username) : '#'}>
            <User className="h-4 w-4" />
            Profil public
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={ROUTES.dashboard.settings}>
            <Settings className="h-4 w-4" />
            Paramètres
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive focus:bg-destructive/10">
          <LogOut className="h-4 w-4" />
          Déconnexion
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}