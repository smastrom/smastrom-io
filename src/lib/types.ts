import type { Document } from 'datocms-structured-text-utils'

// API Routes

export type PackageSlug = `@${string}/${string}` | string

export interface OurPackage {
   title: string
   total_downloads: number
   weekly_downloads: number
   monthly_downloads: number
   stargazers_count: number
   description: string
   created_at: string
   demo_url: string | null
   npm_url: string
   github_url: string
}

// DatoCMS API

type Seo = {
   title: string
   description: string
}

export interface CmsLayout {
   _site: { globalSeo: { siteName: string; fallbackSeo: Seo } }
   layout: { footerText: string }
}

export type BlockProperties = {
   __typename: string
   id: string
}

export type ArticleImageBlock = BlockProperties & {
   image: {
      alt: string
      width: number
      height: number
      url: string
   }
}

export type IndexPage = {
   home: {
      seo: Seo
      title: string
      body: {
         value: Document
         blocks: ArticleImageBlock[]
      }
   }
}

export interface OpenSourcePage {
   openSource: {
      seo: Seo
      title: string
      text: string
   }
}

export interface ServicesPage {
   servicesPage: {
      seo: Seo
      title: string
      subtitle: string
      sections: {
         title: string
         text: string
      }[]
      services: {
         caption: string
         title: string
         image: {
            url: string
         }
         imageDescription: string
         description: string
      }[]
   }
}

// GitHub API

export interface GitHubRepositoryApiResponse {
   id: number
   node_id: string
   name: string
   full_name: string
   private: boolean
   owner: {
      login: string
      id: number
      node_id: string
      avatar_url: string
      gravatar_id: string
      url: string
      html_url: string
      followers_url: string
      following_url: string
      gists_url: string
      starred_url: string
      subscriptions_url: string
      organizations_url: string
      repos_url: string
      events_url: string
      received_events_url: string
      type: string
      user_view_type: string
      site_admin: boolean
   }
   html_url: string
   description: string
   fork: boolean
   url: string
   forks_url: string
   keys_url: string
   collaborators_url: string
   teams_url: string
   hooks_url: string
   issue_events_url: string
   events_url: string
   assignees_url: string
   branches_url: string
   tags_url: string
   blobs_url: string
   git_tags_url: string
   git_refs_url: string
   trees_url: string
   statuses_url: string
   languages_url: string
   stargazers_url: string
   contributors_url: string
   subscribers_url: string
   subscription_url: string
   commits_url: string
   git_commits_url: string
   comments_url: string
   issue_comment_url: string
   contents_url: string
   compare_url: string
   merges_url: string
   archive_url: string
   downloads_url: string
   issues_url: string
   pulls_url: string
   milestones_url: string
   notifications_url: string
   labels_url: string
   releases_url: string
   deployments_url: string
   created_at: string
   updated_at: string
   pushed_at: string
   git_url: string
   ssh_url: string
   clone_url: string
   svn_url: string
   homepage: string | null
   size: number
   stargazers_count: number
   watchers_count: number
   language: string | null
   has_issues: boolean
   has_projects: boolean
   has_downloads: boolean
   has_wiki: boolean
   has_pages: boolean
   has_discussions: boolean
   forks_count: number
   mirror_url: string | null
   archived: boolean
   disabled: boolean
   open_issues_count: number
   license: {
      key: string
      name: string
      spdx_id: string
      url: string
      node_id: string
   }
   allow_forking: boolean
   is_template: boolean
   web_commit_signoff_required: boolean
   topics: string[]
   visibility: string
   forks: number
   open_issues: number
   watchers: number
   default_branch: string
   permissions: {
      admin: boolean
      maintain: boolean
      push: boolean
      triage: boolean
      pull: boolean
   }
   network_count: number
   subscribers_count: number
}

// NPM API

export interface NpmPackageApiResponse {
   downloads: {
      monthly: number
      weekly: number
   }
   dependents: string
   updated: string
   searchScore: number
   package: {
      name: string
      keywords: string[]
      version: string
      description: string
      sanitized_name: string
      publisher: {
         email: string
         username: string
      }
      maintainers: {
         email: string
         username: string
      }
      license: string
      date: string
      links: {
         homepage: string
         repository: string
         bugs: string
         npm: string
      }
   }
   score: {
      final: number
      detail: {
         popularity: number
         quality: number
         maintenance: number
      }
   }
   flags: {
      insecure: number
   }
}

export interface NpmSearchApiResponse {
   total: number
   time: string
   objects: NpmPackageApiResponse[]
}

export interface NpmDownloadApiResponse {
   downloads: number
   start: string
   end: string
   package: string
}
