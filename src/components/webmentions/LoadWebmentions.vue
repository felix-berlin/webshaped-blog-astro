<template>
  <Transition name="fade" mode="in-out">
    <div>
      <Suspense>
        <Webmentions
          :current-url="false"
          target="https://develop.webshaped-blog-astro.pages.dev/de/matomo-tracking-script-optimal-einbinden/"
        />

        <template #fallback>
          <div id="webmentions" class="card is-loading">
            <div class="image" />
            <div class="content">
              <!-- eslint-disable-next-line vuejs-accessibility/heading-has-content -->
              <h2 />
              <p />
            </div>
          </div>
        </template>
      </Suspense>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import Webmentions from "@components/webmentions/Webmentions.vue";
</script>

<style scoped lang="scss">
.card {
  margin: 10px;
  width: 300px;
  background: #fff;
  border-radius: 5px;
  box-shadow: 0 0 10px rgb(0 0 0 / 5%);

  .image {
    img {
      max-width: 100%;
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
    }
  }

  .content {
    padding: 20px 30px;
  }
}

.card.is-loading {
  .image,
  h2,
  p {
    background: #eee;
    background: linear-gradient(110deg, #ececec 8%, #f5f5f5 18%, #ececec 33%);
    border-radius: 5px;
    background-size: 200% 100%;
    animation: 1.5s shine linear infinite;
  }

  .image {
    height: 200px;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  h2 {
    height: 30px;
  }

  p {
    height: 70px;
  }
}

@keyframes shine {
  to {
    background-position-x: -200%;
  }
}
</style>
