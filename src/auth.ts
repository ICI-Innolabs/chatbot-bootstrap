import { SvelteKitAuth } from '@auth/sveltekit';
import type { Provider } from '@auth/sveltekit/providers';
import { PrismaAdapter } from '@auth/prisma-adapter';
import GitHub from '@auth/sveltekit/providers/github';
import Google from '@auth/sveltekit/providers/google';
import Twitter from '@auth/sveltekit/providers/twitter';

import { prisma } from '$lib/db/prisma';

import { env } from '$env/dynamic/private';

const providers: Provider[] = [
	Google({
		clientId: env.AUTH_GOOGLE_ID,
		clientSecret: env.AUTH_GOOGLE_SECRET
	}),
	GitHub({
		clientId: env.AUTH_GITHUB_ID,
		clientSecret: env.AUTH_GITHUB_SECRET
	}),
	Twitter({
		clientId: env.AUTH_TWITTER_ID,
		clientSecret: env.AUTH_TWITTER_SECRET
	})
];

export const providerMap = providers.map((provider) => {
	if (typeof provider === 'function') {
		const providerData = provider();
		return { id: providerData.id, name: providerData.name };
	} else {
		return { id: provider.id, name: provider.name };
	}
});

export const { handle, signIn, signOut } = SvelteKitAuth({
	adapter: PrismaAdapter(prisma),
	providers,
	pages: {
		signIn: '/auth/login',
		signOut: '/auth/signout',
		error: '/auth/login'
	},
	secret: env.AUTH_SECRET,
	trustHost: true,
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.email = user.email;
				token.name = user.name;
			}
			return token;
		},
		async session({ session, token }) {
			if (token) {
				session.user.email = token.email ?? '';
				session.user.name = token.name;
			}
			return session;
		}
	}
});
