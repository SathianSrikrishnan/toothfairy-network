import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Tooth Fairy Network - Read the Stories',
  description: 'Seven tooth tradition storybooks, seven keepers, and one growing family memory network.',
}

export default function StoryPage() {
  redirect('/toothfairy/stories')
}
