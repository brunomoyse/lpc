export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: any;
  DateTime: any;
};

export type CashGame = {
  __typename?: 'CashGame';
  blinds?: Maybe<Scalars['String']>;
  createdAt: Scalars['DateTime'];
  id: Scalars['String'];
  maxRegistrations?: Maybe<Scalars['Int']>;
  organizer?: Maybe<User>;
  scheduledAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  users: Array<Maybe<CashGameRegistration>>;
};

export type CashGameRegistration = {
  __typename?: 'CashGameRegistration';
  cashGame: CashGame;
  createdAt: Scalars['DateTime'];
  id: Scalars['String'];
  registrationDate: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  user: User;
};

export type Count = {
  __typename?: 'Count';
  tournamentRegistrations?: Maybe<Scalars['Int']>;
  tournamentResults?: Maybe<Scalars['Int']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createTournament: Tournament;
  createTournamentRegistration?: Maybe<Tournament>;
  createTournamentResult?: Maybe<TournamentResult>;
  createTournamentTag?: Maybe<TournamentTag>;
  createUser: User;
  deleteTournamentRegistration?: Maybe<Tournament>;
  deleteTournamentResult?: Maybe<TournamentResult>;
  deleteUser: User;
  updateTournament: Tournament;
  updateUser: User;
};


export type MutationCreateTournamentArgs = {
  buyIn?: InputMaybe<Scalars['Float']>;
  guaranteedPrizePool?: InputMaybe<Scalars['Float']>;
  imgPath?: InputMaybe<Scalars['String']>;
  lateRegistrationAt?: InputMaybe<Scalars['DateTime']>;
  maxRegistrations?: InputMaybe<Scalars['Int']>;
  multipleDays?: InputMaybe<Scalars['Boolean']>;
  name: Scalars['String'];
  reentry?: InputMaybe<Scalars['Boolean']>;
  scheduledAt?: InputMaybe<Scalars['DateTime']>;
  tournamentTags?: InputMaybe<Array<Scalars['String']>>;
};


export type MutationCreateTournamentRegistrationArgs = {
  tournamentId: Scalars['ID'];
  userId: Scalars['ID'];
};


export type MutationCreateTournamentResultArgs = {
  position: Scalars['Int'];
  prize?: InputMaybe<Scalars['Float']>;
  tournamentId: Scalars['ID'];
  userId?: InputMaybe<Scalars['ID']>;
};


export type MutationCreateTournamentTagArgs = {
  name: Scalars['String'];
};


export type MutationCreateUserArgs = {
  email: Scalars['String'];
  firstName?: InputMaybe<Scalars['String']>;
  isMember?: InputMaybe<Scalars['Boolean']>;
  lastName?: InputMaybe<Scalars['String']>;
  nickName?: InputMaybe<Scalars['String']>;
  password: Scalars['String'];
  roleId?: InputMaybe<Scalars['ID']>;
  teamId?: InputMaybe<Scalars['ID']>;
};


export type MutationDeleteTournamentRegistrationArgs = {
  tournamentId: Scalars['ID'];
  userId: Scalars['ID'];
};


export type MutationDeleteTournamentResultArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['ID'];
};


export type MutationUpdateTournamentArgs = {
  buyIn?: InputMaybe<Scalars['Float']>;
  guaranteedPrizePool?: InputMaybe<Scalars['Float']>;
  id: Scalars['ID'];
  imgPath?: InputMaybe<Scalars['String']>;
  lateRegistrationAt?: InputMaybe<Scalars['DateTime']>;
  maxRegistrations?: InputMaybe<Scalars['Int']>;
  multipleDays?: InputMaybe<Scalars['Boolean']>;
  name?: InputMaybe<Scalars['String']>;
  reentry?: InputMaybe<Scalars['Boolean']>;
  scheduledAt?: InputMaybe<Scalars['DateTime']>;
  tournamentTags?: InputMaybe<Array<Scalars['String']>>;
};


export type MutationUpdateUserArgs = {
  email?: InputMaybe<Scalars['String']>;
  firstName?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  isMember?: InputMaybe<Scalars['Boolean']>;
  lastName?: InputMaybe<Scalars['String']>;
  nickName?: InputMaybe<Scalars['String']>;
  password?: InputMaybe<Scalars['String']>;
  roleId?: InputMaybe<Scalars['ID']>;
  teamId?: InputMaybe<Scalars['ID']>;
};

export type Query = {
  __typename?: 'Query';
  team: Team;
  teams: Array<Team>;
  tournament: Tournament;
  tournamentEntriesCount: Scalars['Int'];
  tournaments: Array<Tournament>;
  user: User;
  users: Array<User>;
};


export type QueryTeamArgs = {
  id: Scalars['ID'];
};


export type QueryTeamsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
};


export type QueryTournamentArgs = {
  id: Scalars['ID'];
};


export type QueryTournamentEntriesCountArgs = {
  tournamentId: Scalars['ID'];
};


export type QueryTournamentsArgs = {
  endingRange?: InputMaybe<Scalars['Date']>;
  skip?: InputMaybe<Scalars['Int']>;
  startingRange?: InputMaybe<Scalars['Date']>;
  take?: InputMaybe<Scalars['Int']>;
  userId?: InputMaybe<Scalars['ID']>;
};


export type QueryUserArgs = {
  id: Scalars['ID'];
};


export type QueryUsersArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
};

export type Role = {
  __typename?: 'Role';
  createdAt: Scalars['DateTime'];
  id: Scalars['String'];
  name: Scalars['String'];
  updatedAt: Scalars['DateTime'];
  users: Array<Maybe<User>>;
};

export type Team = {
  __typename?: 'Team';
  createdAt: Scalars['DateTime'];
  id: Scalars['String'];
  name: Scalars['String'];
  updatedAt: Scalars['DateTime'];
  users: Array<Maybe<User>>;
};

export type Tournament = {
  __typename?: 'Tournament';
  _count?: Maybe<Count>;
  avatarPath?: Maybe<Scalars['String']>;
  buyIn?: Maybe<Scalars['Float']>;
  createdAt: Scalars['DateTime'];
  guaranteedPrizePool?: Maybe<Scalars['Float']>;
  id: Scalars['String'];
  imgPath?: Maybe<Scalars['String']>;
  isMember?: Maybe<Scalars['Boolean']>;
  lateRegistrationAt?: Maybe<Scalars['DateTime']>;
  maxRegistrations?: Maybe<Scalars['Int']>;
  memberNumber?: Maybe<Scalars['String']>;
  multipleDays?: Maybe<Scalars['Boolean']>;
  name: Scalars['String'];
  reentry?: Maybe<Scalars['Boolean']>;
  scheduledAt?: Maybe<Scalars['DateTime']>;
  tournamentRegistrations?: Maybe<Array<TournamentRegistration>>;
  tournamentResults?: Maybe<Array<TournamentResult>>;
  tournamentTags?: Maybe<Array<TournamentTag>>;
  updatedAt: Scalars['DateTime'];
};

export type TournamentRegistration = {
  __typename?: 'TournamentRegistration';
  createdAt: Scalars['DateTime'];
  id: Scalars['String'];
  tournament: Tournament;
  updatedAt: Scalars['DateTime'];
  user: User;
};

export type TournamentResult = {
  __typename?: 'TournamentResult';
  createdAt: Scalars['DateTime'];
  id: Scalars['String'];
  position?: Maybe<Scalars['Int']>;
  prize?: Maybe<Scalars['Float']>;
  tournament: Tournament;
  updatedAt: Scalars['DateTime'];
  user: User;
};

export type TournamentTag = {
  __typename?: 'TournamentTag';
  createdAt: Scalars['DateTime'];
  icon?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  name: Scalars['String'];
  tournaments?: Maybe<Array<Tournament>>;
  updatedAt: Scalars['DateTime'];
};

export type User = {
  __typename?: 'User';
  cashGameOrganized: Array<Maybe<CashGame>>;
  cashGamePlayed: Array<Maybe<CashGameRegistration>>;
  createdAt: Scalars['DateTime'];
  email: Scalars['String'];
  firstName: Scalars['String'];
  id: Scalars['String'];
  isMember: Scalars['Boolean'];
  lastName: Scalars['String'];
  nickName?: Maybe<Scalars['String']>;
  password: Scalars['String'];
  role: Role;
  team?: Maybe<Team>;
  tournamentRegistrations: Array<Maybe<TournamentRegistration>>;
  tournamentResults: Array<Maybe<TournamentResult>>;
  updatedAt: Scalars['DateTime'];
};
