/**
 * @type {import('semantic-release').GlobalConfig}
 */
export default {
  release: {
    branches: ["main", "beta"],
  },
  branches: [
    "main",
    {
      name: "beta",
      prerelease: true,
    },
  ],
  tagFormat: "v${version}",
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    [
      "@semantic-release/exec",
      {
        prepareCmd: "npm pkg set version=${nextRelease.version}",
      },
    ],
    [
      "@semantic-release/changelog",
      {
        changelogTitle:
          "# Changelog\n\nAll notable changes to this project will be documented in this file. See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.",
      },
    ],
    [
      "@semantic-release/git",
      {
        assets: ["CHANGELOG.md", "package.json", "package-lock.json", "npm-shrinkwrap.json"],
        message: "chore(release): publish version ${nextRelease.version}",
      },
    ],
    [
      "@semantic-release/github",
      {
        message:
          "Release <%= nextRelease.version %> - <%= new Date().toLocaleDateString('en-US', {year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' }) %> [skip ci]\n\n<%= nextRelease.notes %>",
      },
    ],
  ],
  dryRun: false,
};
