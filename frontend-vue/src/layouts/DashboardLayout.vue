<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import { Search, Bell, LogOut } from 'lucide-vue-next'
import { roleMenus } from '@/mocks/campData'
import { useAuthStore } from '@/stores/auth'
import LucideIcon from '@/components/ui/LucideIcon.vue'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const menuItems = computed(() => roleMenus[auth.role] || roleMenus.student)
const currentTitle = computed(() => route.meta.title || 'Dashboard')

async function signOut() {
  await ElMessageBox.confirm('Sign out from Basketball Camp?', 'Confirm Sign Out', {
    confirmButtonText: 'Sign Out',
    cancelButtonText: 'Stay',
    type: 'warning',
  })
  auth.signOut()
  router.push('/sign-in')
}
</script>

<template>
  <el-container class="app-shell">
    <el-aside width="280px" class="app-sidebar">
      <RouterLink class="brand-lockup" :to="auth.homeRoute">
        <span class="brand-mark">BC</span>
        <span>
          <strong>Basketball Camp</strong>
          <small>Training Web Portal</small>
        </span>
      </RouterLink>

      <div class="role-summary">
        <p>{{ auth.roleLabel }}</p>
        <span>Role-based workspace</span>
      </div>

      <el-menu :default-active="route.path" router class="side-menu">
        <el-menu-item v-for="item in menuItems" :key="item.path" :index="item.path">
          <LucideIcon :name="item.icon" />
          <span>{{ item.label }}</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header class="app-header" height="76px">
        <div>
          <p class="eyebrow">Basketball Camp</p>
          <h2>{{ currentTitle }}</h2>
        </div>
        <div class="header-actions">
          <el-input class="global-search" placeholder="Search classes, students, reports">
            <template #prefix>
              <Search :size="18" />
            </template>
          </el-input>
          <el-button circle aria-label="Notifications">
            <Bell :size="18" />
          </el-button>
          <div class="user-chip">
            <span>{{ auth.initials }}</span>
            <div>
              <strong>{{ auth.profileName }}</strong>
              <small>{{ auth.roleLabel }}</small>
            </div>
          </div>
          <el-button type="primary" plain @click="signOut">
            <LogOut :size="17" />
            Sign Out
          </el-button>
        </div>
      </el-header>

      <el-main class="app-main">
        <el-breadcrumb separator="/" class="breadcrumb">
          <el-breadcrumb-item>Basketball Camp</el-breadcrumb-item>
          <el-breadcrumb-item>{{ auth.roleLabel }}</el-breadcrumb-item>
          <el-breadcrumb-item>{{ currentTitle }}</el-breadcrumb-item>
        </el-breadcrumb>
        <RouterView />
      </el-main>
    </el-container>
  </el-container>
</template>
