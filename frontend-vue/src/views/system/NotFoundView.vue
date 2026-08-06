<template>
  <main class="system-page">
    <el-result title="Page Not Found" sub-title="The page you requested does not exist.">
      <template #extra>
        <RouterLink to="/sign-in">
          <el-button type="primary">Back to Sign In</el-button>
        </RouterLink>
      </template>
    </el-result>
  </main>
</template>
