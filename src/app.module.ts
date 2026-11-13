import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { GraphqlContext } from './graphql/graphql-context';
import { LoadersFactory } from './graphql/loaders.factory';
import { LoadersModule } from './graphql/loaders.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [LoadersModule],
      inject: [LoadersFactory],
      useFactory: (loaders: LoadersFactory) => ({
        autoSchemaFile: true,
        sortSchema: true,
        // Apollo Sandbox is the public face of the card, so it stays on in production.
        playground: false,
        introspection: true,
        plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })],
        context: (): GraphqlContext => ({ loaders: loaders.create() }),
      }),
    }),
  ],
})
export class AppModule {}
