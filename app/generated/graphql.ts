import type { GraphQLClient, RequestOptions } from 'graphql-request';
import gql from 'graphql-tag';

export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
type GraphQLClientRequestHeaders = RequestOptions['requestHeaders'];
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
	ID: { input: string; output: string };
	String: { input: string; output: string };
	Boolean: { input: boolean; output: boolean };
	Int: { input: number; output: number };
	Float: { input: number; output: number };
	DateTime: { input: Date; output: string };
	JSON: { input: Record<string, unknown>; output: Record<string, unknown> };
};

export enum AccountTypeClass {
	Asset = 'Asset',
	Equity = 'Equity',
	Expense = 'Expense',
	Liability = 'Liability',
	Revenue = 'Revenue'
}

export type AsOfReportEntryModel = {
	accountTypeClass: AccountTypeClass;
	accountTypeName: Scalars['String']['output'];
	accountTypeSortOrder: Scalars['Int']['output'];
	balance: Scalars['Int']['output'];
	credits: Scalars['Int']['output'];
	debits: Scalars['Int']['output'];
	entryCount: Scalars['Int']['output'];
	glAccountId: Scalars['String']['output'];
	glAccountName: Scalars['String']['output'];
	glAccountNumber: Scalars['Int']['output'];
};

export type Asset = {
	_count: AssetCount;
	accumulatedAccount: GlAccount;
	accumulatedAccountNumber: Scalars['Int']['output'];
	assetAccount: GlAccount;
	assetAccountNumber: Scalars['Int']['output'];
	assetChanges: Array<AssetChange>;
	assetLifetime: Scalars['Int']['output'];
	category: AssetCategory;
	createdAt: Scalars['DateTime']['output'];
	currentCost: Scalars['Int']['output'];
	depreciationExpenseAccount: GlAccount;
	depreciationExpenseAccountNumber: Scalars['Int']['output'];
	entity: Entity;
	entityId: Scalars['Int']['output'];
	generatesDepreciation: Scalars['Boolean']['output'];
	id: Scalars['Int']['output'];
	name: Scalars['String']['output'];
	netBookValue: Scalars['Int']['output'];
	originalCost: Scalars['Int']['output'];
	originatingEntryId: Scalars['Int']['output'];
	originatingJournalEntry: JournalEntry;
	originationDate: Scalars['DateTime']['output'];
	realizedAccount: GlAccount;
	realizedAccountNumber: Scalars['Int']['output'];
	status: AssetStatus;
	unrealizedAccount: GlAccount;
	unrealizedAccountNumber: Scalars['Int']['output'];
	updatedAt: Scalars['DateTime']['output'];
};

export enum AssetCategory {
	General = 'General',
	Investment = 'Investment',
	LongTerm = 'LongTerm'
}

export type AssetChange = {
	amount: Scalars['Int']['output'];
	asset: Asset;
	assetId: Scalars['Int']['output'];
	assetMonth: Scalars['Int']['output'];
	changeType: AssetChangeType;
	createdAt: Scalars['DateTime']['output'];
	effectiveDate: Scalars['DateTime']['output'];
	generatedJournal?: Maybe<Journal>;
	id: Scalars['Int']['output'];
	isForecast: Scalars['Boolean']['output'];
	relatedEntryId?: Maybe<Scalars['Int']['output']>;
	relatedEntryLine?: Maybe<JournalEntry>;
	updatedAt: Scalars['DateTime']['output'];
};

export type AssetChangeNullableScalarRelationFilter = {
	is?: InputMaybe<AssetChangeWhereInput>;
	isNot?: InputMaybe<AssetChangeWhereInput>;
};

export type AssetChangeOrderByWithRelationInput = {
	amount?: InputMaybe<SortOrder>;
	asset?: InputMaybe<AssetOrderByWithRelationInput>;
	assetId?: InputMaybe<SortOrder>;
	assetMonth?: InputMaybe<SortOrder>;
	changeType?: InputMaybe<SortOrder>;
	createdAt?: InputMaybe<SortOrder>;
	effectiveDate?: InputMaybe<SortOrder>;
	generatedJournal?: InputMaybe<JournalOrderByWithRelationInput>;
	id?: InputMaybe<SortOrder>;
	isForecast?: InputMaybe<SortOrder>;
	relatedEntryId?: InputMaybe<SortOrderInput>;
	relatedEntryLine?: InputMaybe<JournalEntryOrderByWithRelationInput>;
	updatedAt?: InputMaybe<SortOrder>;
};

export type AssetChangeResultModel = {
	amount: Scalars['Int']['output'];
	assetMonth: Scalars['Int']['output'];
	assetValuesUpdated: Scalars['Boolean']['output'];
	changeType: AssetChangeType;
	effectiveDate: Scalars['DateTime']['output'];
	generatedJournalNumber?: Maybe<Scalars['Int']['output']>;
	id: Scalars['Int']['output'];
	isForecast: Scalars['Boolean']['output'];
};

export enum AssetChangeType {
	Cost = 'Cost',
	Depreciation = 'Depreciation',
	Disposal = 'Disposal',
	Origination = 'Origination',
	Revaluation = 'Revaluation'
}

export type AssetChangeWhereInput = {
	AND?: InputMaybe<Array<AssetChangeWhereInput>>;
	NOT?: InputMaybe<Array<AssetChangeWhereInput>>;
	OR?: InputMaybe<Array<AssetChangeWhereInput>>;
	amount?: InputMaybe<IntFilter>;
	asset?: InputMaybe<AssetScalarRelationFilter>;
	assetId?: InputMaybe<IntFilter>;
	assetMonth?: InputMaybe<IntFilter>;
	changeType?: InputMaybe<EnumAssetChangeTypeFilter>;
	createdAt?: InputMaybe<DateTimeFilter>;
	effectiveDate?: InputMaybe<DateTimeFilter>;
	generatedJournal?: InputMaybe<JournalNullableScalarRelationFilter>;
	id?: InputMaybe<IntFilter>;
	isForecast?: InputMaybe<BoolFilter>;
	relatedEntryId?: InputMaybe<IntNullableFilter>;
	relatedEntryLine?: InputMaybe<JournalEntryNullableScalarRelationFilter>;
	updatedAt?: InputMaybe<DateTimeFilter>;
};

export type AssetChangeWhereUniqueInput = {
	id?: InputMaybe<Scalars['Int']['input']>;
	relatedEntryId?: InputMaybe<Scalars['Int']['input']>;
};

export type AssetCount = {
	assetChanges: Scalars['Int']['output'];
};

export type AssetListRelationFilter = {
	every?: InputMaybe<AssetWhereInput>;
	none?: InputMaybe<AssetWhereInput>;
	some?: InputMaybe<AssetWhereInput>;
};

export type AssetNullableScalarRelationFilter = {
	is?: InputMaybe<AssetWhereInput>;
	isNot?: InputMaybe<AssetWhereInput>;
};

export type AssetOrderByWithRelationInput = {
	accumulatedAccount?: InputMaybe<GlAccountOrderByWithRelationInput>;
	accumulatedAccountNumber?: InputMaybe<SortOrder>;
	assetAccount?: InputMaybe<GlAccountOrderByWithRelationInput>;
	assetAccountNumber?: InputMaybe<SortOrder>;
	assetLifetime?: InputMaybe<SortOrder>;
	category?: InputMaybe<SortOrder>;
	createdAt?: InputMaybe<SortOrder>;
	currentCost?: InputMaybe<SortOrder>;
	depreciationExpenseAccount?: InputMaybe<GlAccountOrderByWithRelationInput>;
	depreciationExpenseAccountNumber?: InputMaybe<SortOrder>;
	entity?: InputMaybe<EntityOrderByWithRelationInput>;
	entityId?: InputMaybe<SortOrder>;
	generatesDepreciation?: InputMaybe<SortOrder>;
	id?: InputMaybe<SortOrder>;
	name?: InputMaybe<SortOrder>;
	netBookValue?: InputMaybe<SortOrder>;
	originalCost?: InputMaybe<SortOrder>;
	originatingEntryId?: InputMaybe<SortOrder>;
	originatingJournalEntry?: InputMaybe<JournalEntryOrderByWithRelationInput>;
	originationDate?: InputMaybe<SortOrder>;
	realizedAccount?: InputMaybe<GlAccountOrderByWithRelationInput>;
	realizedAccountNumber?: InputMaybe<SortOrder>;
	status?: InputMaybe<SortOrder>;
	unrealizedAccount?: InputMaybe<GlAccountOrderByWithRelationInput>;
	unrealizedAccountNumber?: InputMaybe<SortOrder>;
	updatedAt?: InputMaybe<SortOrder>;
};

export type AssetResultModel = {
	_count: AssetCount;
	category: AssetCategory;
	id: Scalars['Int']['output'];
	name: Scalars['String']['output'];
	status: AssetStatus;
};

export type AssetScalarRelationFilter = {
	is?: InputMaybe<AssetWhereInput>;
	isNot?: InputMaybe<AssetWhereInput>;
};

export enum AssetStatus {
	Active = 'Active',
	Depreciated = 'Depreciated',
	Depreciating = 'Depreciating',
	Disposed = 'Disposed',
	New = 'New'
}

export type AssetUpdateInput = {
	assetLifetime?: InputMaybe<Scalars['Int']['input']>;
	category?: InputMaybe<AssetCategory>;
	generatesDepreciation?: InputMaybe<Scalars['Boolean']['input']>;
	name?: InputMaybe<Scalars['String']['input']>;
};

export type AssetValResultModel = {
	_count: AssetCount;
	category: AssetCategory;
	hasChanges: Scalars['Boolean']['output'];
	id: Scalars['Int']['output'];
	name: Scalars['String']['output'];
	status: AssetStatus;
};

export type AssetWhereInput = {
	AND?: InputMaybe<Array<AssetWhereInput>>;
	NOT?: InputMaybe<Array<AssetWhereInput>>;
	OR?: InputMaybe<Array<AssetWhereInput>>;
	accumulatedAccount?: InputMaybe<GlAccountScalarRelationFilter>;
	accumulatedAccountNumber?: InputMaybe<IntFilter>;
	assetAccount?: InputMaybe<GlAccountScalarRelationFilter>;
	assetAccountNumber?: InputMaybe<IntFilter>;
	assetLifetime?: InputMaybe<IntFilter>;
	category?: InputMaybe<EnumAssetCategoryFilter>;
	createdAt?: InputMaybe<DateTimeFilter>;
	currentCost?: InputMaybe<IntFilter>;
	depreciationExpenseAccount?: InputMaybe<GlAccountScalarRelationFilter>;
	depreciationExpenseAccountNumber?: InputMaybe<IntFilter>;
	entityId?: InputMaybe<IntFilter>;
	generatesDepreciation?: InputMaybe<BoolFilter>;
	id?: InputMaybe<IntFilter>;
	name?: InputMaybe<StringFilter>;
	netBookValue?: InputMaybe<IntFilter>;
	originalCost?: InputMaybe<IntFilter>;
	originatingEntryId?: InputMaybe<IntFilter>;
	originatingJournalEntry?: InputMaybe<JournalEntryScalarRelationFilter>;
	originationDate?: InputMaybe<DateTimeFilter>;
	realizedAccount?: InputMaybe<GlAccountScalarRelationFilter>;
	realizedAccountNumber?: InputMaybe<IntFilter>;
	status?: InputMaybe<EnumAssetStatusFilter>;
	unrealizedAccount?: InputMaybe<GlAccountScalarRelationFilter>;
	unrealizedAccountNumber?: InputMaybe<IntFilter>;
	updatedAt?: InputMaybe<DateTimeFilter>;
};

export type AssetWhereUniqueInput = {
	id?: InputMaybe<Scalars['Int']['input']>;
	name?: InputMaybe<Scalars['String']['input']>;
};

export type Book = {
	_count: BookCount;
	createdAt: Scalars['DateTime']['output'];
	id: Scalars['Int']['output'];
	journals?: Maybe<Array<Journal>>;
	name: Scalars['String']['output'];
	system: Scalars['Boolean']['output'];
	updatedAt: Scalars['DateTime']['output'];
};

export type BookCount = {
	journals: Scalars['Int']['output'];
};

export type BookNullableScalarRelationFilter = {
	is?: InputMaybe<BookWhereInput>;
	isNot?: InputMaybe<BookWhereInput>;
};

export type BookOrderByWithRelationInput = {
	createdAt?: InputMaybe<SortOrder>;
	id?: InputMaybe<SortOrder>;
	name?: InputMaybe<SortOrder>;
	system?: InputMaybe<SortOrder>;
	updatedAt?: InputMaybe<SortOrder>;
};

export type BookWhereInput = {
	AND?: InputMaybe<Array<BookWhereInput>>;
	NOT?: InputMaybe<Array<BookWhereInput>>;
	OR?: InputMaybe<Array<BookWhereInput>>;
	createdAt?: InputMaybe<DateTimeFilter>;
	id?: InputMaybe<IntFilter>;
	name?: InputMaybe<StringFilter>;
	system?: InputMaybe<BoolFilter>;
	updatedAt?: InputMaybe<DateTimeFilter>;
};

export type BookWhereUniqueInput = {
	AND?: InputMaybe<Array<BookWhereInput>>;
	NOT?: InputMaybe<Array<BookWhereInput>>;
	OR?: InputMaybe<Array<BookWhereInput>>;
	createdAt?: InputMaybe<DateTimeFilter>;
	id?: InputMaybe<Scalars['Int']['input']>;
	name?: InputMaybe<Scalars['String']['input']>;
	system?: InputMaybe<BoolFilter>;
	updatedAt?: InputMaybe<DateTimeFilter>;
};

export type BoolFilter = {
	equals?: InputMaybe<Scalars['Boolean']['input']>;
	not?: InputMaybe<NestedBoolFilter>;
};

export type BulkImportJobSubmission = {
	_count: BulkImportJobSubmissionCount;
	attempts: Scalars['Int']['output'];
	createdAt: Scalars['DateTime']['output'];
	errorCount: Scalars['Int']['output'];
	finishedAt?: Maybe<Scalars['DateTime']['output']>;
	id: Scalars['String']['output'];
	jobError?: Maybe<Scalars['String']['output']>;
	queue: Scalars['String']['output'];
	recordTotal: Scalars['Int']['output'];
	records?: Maybe<Array<BulkImportRecord>>;
	startedAt?: Maybe<Scalars['DateTime']['output']>;
	status: JobStatus;
	successCount: Scalars['Int']['output'];
	updatedAt: Scalars['DateTime']['output'];
};

export type BulkImportJobSubmissionCount = {
	records: Scalars['Int']['output'];
};

export type BulkImportJobSubmissionOrderByWithRelationInput = {
	attempts?: InputMaybe<SortOrder>;
	createdAt?: InputMaybe<SortOrder>;
	errorCount?: InputMaybe<SortOrder>;
	finishedAt?: InputMaybe<SortOrderInput>;
	id?: InputMaybe<SortOrder>;
	jobError?: InputMaybe<SortOrderInput>;
	queue?: InputMaybe<SortOrder>;
	recordTotal?: InputMaybe<SortOrder>;
	startedAt?: InputMaybe<SortOrderInput>;
	status?: InputMaybe<SortOrder>;
	successCount?: InputMaybe<SortOrder>;
	updatedAt?: InputMaybe<SortOrder>;
};

export type BulkImportJobSubmissionScalarRelationFilter = {
	is?: InputMaybe<BulkImportJobSubmissionWhereInput>;
	isNot?: InputMaybe<BulkImportJobSubmissionWhereInput>;
};

export type BulkImportJobSubmissionWhereInput = {
	AND?: InputMaybe<Array<BulkImportJobSubmissionWhereInput>>;
	NOT?: InputMaybe<Array<BulkImportJobSubmissionWhereInput>>;
	OR?: InputMaybe<Array<BulkImportJobSubmissionWhereInput>>;
	attempts?: InputMaybe<IntFilter>;
	createdAt?: InputMaybe<DateTimeFilter>;
	errorCount?: InputMaybe<IntFilter>;
	finishedAt?: InputMaybe<DateTimeNullableFilter>;
	id?: InputMaybe<StringFilter>;
	jobError?: InputMaybe<StringNullableFilter>;
	queue?: InputMaybe<StringFilter>;
	recordTotal?: InputMaybe<IntFilter>;
	startedAt?: InputMaybe<DateTimeNullableFilter>;
	status?: InputMaybe<EnumJobStatusFilter>;
	successCount?: InputMaybe<IntFilter>;
	updatedAt?: InputMaybe<DateTimeFilter>;
};

export type BulkImportJobSubmissionWhereUniqueInput = {
	id?: InputMaybe<Scalars['String']['input']>;
};

export type BulkImportRecord = {
	createdAt: Scalars['DateTime']['output'];
	id: Scalars['String']['output'];
	isSuccess: Scalars['Boolean']['output'];
	payload: Scalars['JSON']['output'];
	recordError?: Maybe<Scalars['String']['output']>;
	result?: Maybe<Scalars['JSON']['output']>;
	resultMessage?: Maybe<Scalars['String']['output']>;
	submission: BulkImportJobSubmission;
	submissionId: Scalars['String']['output'];
	updatedAt: Scalars['DateTime']['output'];
};

export type BulkImportRecordOrderByWithRelationInput = {
	createdAt?: InputMaybe<SortOrder>;
	id?: InputMaybe<SortOrder>;
	isSuccess?: InputMaybe<SortOrder>;
	payload?: InputMaybe<SortOrder>;
	recordError?: InputMaybe<SortOrderInput>;
	result?: InputMaybe<SortOrderInput>;
	resultMessage?: InputMaybe<SortOrderInput>;
	submission?: InputMaybe<BulkImportJobSubmissionOrderByWithRelationInput>;
	submissionId?: InputMaybe<SortOrder>;
	updatedAt?: InputMaybe<SortOrder>;
};

export type BulkImportRecordWhereInput = {
	AND?: InputMaybe<Array<BulkImportRecordWhereInput>>;
	NOT?: InputMaybe<Array<BulkImportRecordWhereInput>>;
	OR?: InputMaybe<Array<BulkImportRecordWhereInput>>;
	createdAt?: InputMaybe<DateTimeFilter>;
	id?: InputMaybe<StringFilter>;
	isSuccess?: InputMaybe<BoolFilter>;
	recordError?: InputMaybe<StringNullableFilter>;
	resultMessage?: InputMaybe<StringNullableFilter>;
	submission?: InputMaybe<BulkImportJobSubmissionScalarRelationFilter>;
	submissionId?: InputMaybe<StringFilter>;
	updatedAt?: InputMaybe<DateTimeFilter>;
};

export type BulkImportRecordWhereUniqueInput = {
	id?: InputMaybe<Scalars['String']['input']>;
};

export type CountResultModel = {
	count: Scalars['Int']['output'];
};

export type CreateAssetInput = {
	accumulatedAccountNumber: Scalars['Int']['input'];
	assetLifetime: Scalars['Int']['input'];
	category: AssetCategory;
	depreciationExpenseAccountNumber: Scalars['Int']['input'];
	generatesDepreciation?: InputMaybe<Scalars['Boolean']['input']>;
	name: Scalars['String']['input'];
	originatingEntryId: Scalars['Int']['input'];
	originationDate: Scalars['DateTime']['input'];
	realizedAccountNumber: Scalars['Int']['input'];
	unrealizedAccountNumber: Scalars['Int']['input'];
};

export type CreateBookInput = {
	name: Scalars['String']['input'];
};

export type CreateEntityInput = {
	defaultAccountNumber?: InputMaybe<Scalars['Int']['input']>;
	description: Scalars['String']['input'];
	entityType: EntityType;
	name: Scalars['String']['input'];
};

export type CreateLoanInput = {
	annualInterestRate: Scalars['Float']['input'];
	interestAccountNumber: Scalars['Int']['input'];
	name: Scalars['String']['input'];
	originatingEntryId: Scalars['Int']['input'];
	originationDate: Scalars['DateTime']['input'];
	payFromAccountNumber: Scalars['Int']['input'];
	paymentStartDate: Scalars['DateTime']['input'];
	termMonths: Scalars['Int']['input'];
};

export type CreateLoanMigrationJournalInput = {
	changeIds: Array<Scalars['Int']['input']>;
	description: Scalars['String']['input'];
	loanId: Scalars['Int']['input'];
	migrateGlAccountNumber: Scalars['Int']['input'];
	tranDate: Scalars['DateTime']['input'];
};

export type DateTimeFilter = {
	equals?: InputMaybe<Scalars['DateTime']['input']>;
	gt?: InputMaybe<Scalars['DateTime']['input']>;
	gte?: InputMaybe<Scalars['DateTime']['input']>;
	in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
	lt?: InputMaybe<Scalars['DateTime']['input']>;
	lte?: InputMaybe<Scalars['DateTime']['input']>;
	not?: InputMaybe<NestedDateTimeFilter>;
	notIn?: InputMaybe<Array<Scalars['DateTime']['input']>>;
};

export type DateTimeNullableFilter = {
	equals?: InputMaybe<Scalars['DateTime']['input']>;
	gt?: InputMaybe<Scalars['DateTime']['input']>;
	gte?: InputMaybe<Scalars['DateTime']['input']>;
	in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
	lt?: InputMaybe<Scalars['DateTime']['input']>;
	lte?: InputMaybe<Scalars['DateTime']['input']>;
	not?: InputMaybe<NestedDateTimeNullableFilter>;
	notIn?: InputMaybe<Array<Scalars['DateTime']['input']>>;
};

export type Entity = {
	_count: EntityCount;
	assets?: Maybe<Array<Asset>>;
	createdAt: Scalars['DateTime']['output'];
	defaultAccountNumber?: Maybe<Scalars['Int']['output']>;
	defaultGlAccount?: Maybe<GlAccount>;
	description: Scalars['String']['output'];
	entityType: EntityType;
	entries?: Maybe<Array<JournalEntry>>;
	id: Scalars['Int']['output'];
	loans?: Maybe<Array<Loan>>;
	name: Scalars['String']['output'];
	system: Scalars['Boolean']['output'];
	updatedAt: Scalars['DateTime']['output'];
};

export type EntityCount = {
	assets: Scalars['Int']['output'];
	entries: Scalars['Int']['output'];
	loans: Scalars['Int']['output'];
};

export type EntityNullableScalarRelationFilter = {
	is?: InputMaybe<EntityWhereInput>;
	isNot?: InputMaybe<EntityWhereInput>;
};

export type EntityOrderByWithRelationInput = {
	createdAt?: InputMaybe<SortOrder>;
	defaultAccountNumber?: InputMaybe<SortOrderInput>;
	defaultGlAccount?: InputMaybe<GlAccountOrderByWithRelationInput>;
	description?: InputMaybe<SortOrder>;
	entityType?: InputMaybe<SortOrder>;
	id?: InputMaybe<SortOrder>;
	name?: InputMaybe<SortOrder>;
	system?: InputMaybe<SortOrder>;
	updatedAt?: InputMaybe<SortOrder>;
};

export enum EntityType {
	Asset = 'Asset',
	Customer = 'Customer',
	General = 'General',
	Tax = 'Tax',
	Vendor = 'Vendor'
}

export type EntityWhereInput = {
	AND?: InputMaybe<Array<EntityWhereInput>>;
	NOT?: InputMaybe<Array<EntityWhereInput>>;
	OR?: InputMaybe<Array<EntityWhereInput>>;
	createdAt?: InputMaybe<DateTimeFilter>;
	defaultAccountNumber?: InputMaybe<IntNullableFilter>;
	description?: InputMaybe<StringFilter>;
	entityType?: InputMaybe<EnumEntityTypeFilter>;
	id?: InputMaybe<IntFilter>;
	name?: InputMaybe<StringFilter>;
	system?: InputMaybe<BoolFilter>;
	updatedAt?: InputMaybe<DateTimeFilter>;
};

export type EntityWhereUniqueInput = {
	id?: InputMaybe<Scalars['Int']['input']>;
	name?: InputMaybe<Scalars['String']['input']>;
};

export type EnumAccountTypeClassFilter = {
	equals?: InputMaybe<AccountTypeClass>;
	in?: InputMaybe<Array<AccountTypeClass>>;
	not?: InputMaybe<NestedEnumAccountTypeClassFilter>;
	notIn?: InputMaybe<Array<AccountTypeClass>>;
};

export type EnumAssetCategoryFilter = {
	equals?: InputMaybe<AssetCategory>;
	in?: InputMaybe<Array<AssetCategory>>;
	not?: InputMaybe<NestedEnumAssetCategoryFilter>;
	notIn?: InputMaybe<Array<AssetCategory>>;
};

export type EnumAssetChangeTypeFilter = {
	equals?: InputMaybe<AssetChangeType>;
	in?: InputMaybe<Array<AssetChangeType>>;
	not?: InputMaybe<NestedEnumAssetChangeTypeFilter>;
	notIn?: InputMaybe<Array<AssetChangeType>>;
};

export type EnumAssetStatusFilter = {
	equals?: InputMaybe<AssetStatus>;
	in?: InputMaybe<Array<AssetStatus>>;
	not?: InputMaybe<NestedEnumAssetStatusFilter>;
	notIn?: InputMaybe<Array<AssetStatus>>;
};

export type EnumEntityTypeFilter = {
	equals?: InputMaybe<EntityType>;
	in?: InputMaybe<Array<EntityType>>;
	not?: InputMaybe<NestedEnumEntityTypeFilter>;
	notIn?: InputMaybe<Array<EntityType>>;
};

export type EnumGenerationStatusFilter = {
	equals?: InputMaybe<GenerationStatus>;
	in?: InputMaybe<Array<GenerationStatus>>;
	not?: InputMaybe<NestedEnumGenerationStatusFilter>;
	notIn?: InputMaybe<Array<GenerationStatus>>;
};

export type EnumInvestmentChangeTypeFilter = {
	equals?: InputMaybe<InvestmentChangeType>;
	in?: InputMaybe<Array<InvestmentChangeType>>;
	not?: InputMaybe<NestedEnumInvestmentChangeTypeFilter>;
	notIn?: InputMaybe<Array<InvestmentChangeType>>;
};

export type EnumJobStatusFilter = {
	equals?: InputMaybe<JobStatus>;
	in?: InputMaybe<Array<JobStatus>>;
	not?: InputMaybe<NestedEnumJobStatusFilter>;
	notIn?: InputMaybe<Array<JobStatus>>;
};

export type EnumRecurrenceFrequencyFilter = {
	equals?: InputMaybe<RecurrenceFrequency>;
	in?: InputMaybe<Array<RecurrenceFrequency>>;
	not?: InputMaybe<NestedEnumRecurrenceFrequencyFilter>;
	notIn?: InputMaybe<Array<RecurrenceFrequency>>;
};

export type EnumRoleFilter = {
	equals?: InputMaybe<Role>;
	in?: InputMaybe<Array<Role>>;
	not?: InputMaybe<NestedEnumRoleFilter>;
	notIn?: InputMaybe<Array<Role>>;
};

export type EnumSourceTypeFilter = {
	equals?: InputMaybe<SourceType>;
	in?: InputMaybe<Array<SourceType>>;
	not?: InputMaybe<NestedEnumSourceTypeFilter>;
	notIn?: InputMaybe<Array<SourceType>>;
};

export type EnumTillerCategoryTypeFilter = {
	equals?: InputMaybe<TillerCategoryType>;
	in?: InputMaybe<Array<TillerCategoryType>>;
	not?: InputMaybe<NestedEnumTillerCategoryTypeFilter>;
	notIn?: InputMaybe<Array<TillerCategoryType>>;
};

export type EnumWeekdayNullableFilter = {
	equals?: InputMaybe<Weekday>;
	in?: InputMaybe<Array<Weekday>>;
	not?: InputMaybe<NestedEnumWeekdayNullableFilter>;
	notIn?: InputMaybe<Array<Weekday>>;
};

export type FloatFilter = {
	equals?: InputMaybe<Scalars['Float']['input']>;
	gt?: InputMaybe<Scalars['Float']['input']>;
	gte?: InputMaybe<Scalars['Float']['input']>;
	in?: InputMaybe<Array<Scalars['Float']['input']>>;
	lt?: InputMaybe<Scalars['Float']['input']>;
	lte?: InputMaybe<Scalars['Float']['input']>;
	not?: InputMaybe<NestedFloatFilter>;
	notIn?: InputMaybe<Array<Scalars['Float']['input']>>;
};

export type FromEntryInvestmentChangeCreateInput = {
	changeType?: InputMaybe<InvestmentChangeType>;
	effectiveDate: Scalars['DateTime']['input'];
	relatedEntryId: Scalars['Int']['input'];
};

export enum GenerationStatus {
	Active = 'ACTIVE',
	Excluded = 'EXCLUDED',
	Failed = 'FAILED',
	Pending = 'PENDING',
	Processing = 'PROCESSING',
	Success = 'SUCCESS'
}

export type GlAccount = {
	_count: GlAccountCount;
	accountNumber: Scalars['Int']['output'];
	accountType: GlAccountType;
	accountTypeName: Scalars['String']['output'];
	accumulatedGlAccountAssets?: Maybe<Array<Asset>>;
	assetGlAccountAssets?: Maybe<Array<Asset>>;
	createdAt: Scalars['DateTime']['output'];
	depExpenseGlAccountAssets?: Maybe<Array<Asset>>;
	enableReconciliation: Scalars['Boolean']['output'];
	entityDefaultAccounts?: Maybe<Array<Entity>>;
	entries?: Maybe<Array<JournalEntry>>;
	id: Scalars['String']['output'];
	investmentAccAccounts?: Maybe<Array<Investment>>;
	investmentBaseAccounts?: Maybe<Array<Investment>>;
	investmentIncomeAccounts?: Maybe<Array<Investment>>;
	investmentUnrealizedAccounts?: Maybe<Array<Investment>>;
	loanInterestAccounts?: Maybe<Array<Loan>>;
	loanPayFromAccounts?: Maybe<Array<Loan>>;
	loanPrincipalAccounts?: Maybe<Array<Loan>>;
	name: Scalars['String']['output'];
	realizedGlAccountAssets?: Maybe<Array<Asset>>;
	system: Scalars['Boolean']['output'];
	tillerAccounts?: Maybe<TillerAccount>;
	tillerCategories?: Maybe<Array<TillerCategory>>;
	unrealizedGlAccountAssets?: Maybe<Array<Asset>>;
	updatedAt: Scalars['DateTime']['output'];
};

export type GlAccountCount = {
	accumulatedGlAccountAssets: Scalars['Int']['output'];
	assetGlAccountAssets: Scalars['Int']['output'];
	depExpenseGlAccountAssets: Scalars['Int']['output'];
	entityDefaultAccounts: Scalars['Int']['output'];
	entries: Scalars['Int']['output'];
	investmentAccAccounts: Scalars['Int']['output'];
	investmentBaseAccounts: Scalars['Int']['output'];
	investmentIncomeAccounts: Scalars['Int']['output'];
	investmentUnrealizedAccounts: Scalars['Int']['output'];
	loanInterestAccounts: Scalars['Int']['output'];
	loanPayFromAccounts: Scalars['Int']['output'];
	loanPrincipalAccounts: Scalars['Int']['output'];
	realizedGlAccountAssets: Scalars['Int']['output'];
	tillerCategories: Scalars['Int']['output'];
	unrealizedGlAccountAssets: Scalars['Int']['output'];
};

export type GlAccountOrderByWithRelationInput = {
	accountNumber?: InputMaybe<SortOrder>;
	accountType?: InputMaybe<GlAccountTypeOrderByWithRelationInput>;
	accountTypeName?: InputMaybe<SortOrder>;
	createdAt?: InputMaybe<SortOrder>;
	enableReconciliation?: InputMaybe<SortOrder>;
	id?: InputMaybe<SortOrder>;
	name?: InputMaybe<SortOrder>;
	system?: InputMaybe<SortOrder>;
	updatedAt?: InputMaybe<SortOrder>;
};

export type GlAccountScalarRelationFilter = {
	is?: InputMaybe<GlAccountWhereInput>;
	isNot?: InputMaybe<GlAccountWhereInput>;
};

export type GlAccountType = {
	_count: GlAccountTypeCount;
	class: AccountTypeClass;
	createdAt: Scalars['DateTime']['output'];
	glAccounts?: Maybe<Array<GlAccount>>;
	id: Scalars['String']['output'];
	name: Scalars['String']['output'];
	sortOrder: Scalars['Int']['output'];
	system: Scalars['Boolean']['output'];
	updatedAt: Scalars['DateTime']['output'];
};

export type GlAccountTypeCount = {
	glAccounts: Scalars['Int']['output'];
};

export type GlAccountTypeOrderByWithRelationInput = {
	class?: InputMaybe<SortOrder>;
	createdAt?: InputMaybe<SortOrder>;
	id?: InputMaybe<SortOrder>;
	name?: InputMaybe<SortOrder>;
	sortOrder?: InputMaybe<SortOrder>;
	system?: InputMaybe<SortOrder>;
	updatedAt?: InputMaybe<SortOrder>;
};

export type GlAccountTypeScalarRelationFilter = {
	is?: InputMaybe<GlAccountTypeWhereInput>;
	isNot?: InputMaybe<GlAccountTypeWhereInput>;
};

export type GlAccountTypeWhereInput = {
	AND?: InputMaybe<Array<GlAccountTypeWhereInput>>;
	NOT?: InputMaybe<Array<GlAccountTypeWhereInput>>;
	OR?: InputMaybe<Array<GlAccountTypeWhereInput>>;
	class?: InputMaybe<EnumAccountTypeClassFilter>;
	createdAt?: InputMaybe<DateTimeFilter>;
	id?: InputMaybe<StringFilter>;
	name?: InputMaybe<StringFilter>;
	sortOrder?: InputMaybe<IntFilter>;
	system?: InputMaybe<BoolFilter>;
	updatedAt?: InputMaybe<DateTimeFilter>;
};

export type GlAccountTypeWhereUniqueInput = {
	id?: InputMaybe<Scalars['String']['input']>;
	name?: InputMaybe<Scalars['String']['input']>;
	sortOrder?: InputMaybe<Scalars['Int']['input']>;
};

export type GlAccountWhereInput = {
	AND?: InputMaybe<Array<GlAccountWhereInput>>;
	NOT?: InputMaybe<Array<GlAccountWhereInput>>;
	OR?: InputMaybe<Array<GlAccountWhereInput>>;
	accountNumber?: InputMaybe<IntFilter>;
	accountType?: InputMaybe<GlAccountTypeScalarRelationFilter>;
	accountTypeName?: InputMaybe<StringFilter>;
	accumulatedGlAccountAssets?: InputMaybe<AssetListRelationFilter>;
	assetGlAccountAssets?: InputMaybe<AssetListRelationFilter>;
	createdAt?: InputMaybe<DateTimeFilter>;
	depExpenseGlAccountAssets?: InputMaybe<AssetListRelationFilter>;
	enableReconciliation?: InputMaybe<BoolFilter>;
	id?: InputMaybe<StringFilter>;
	investmentAccAccounts?: InputMaybe<InvestmentListRelationFilter>;
	investmentBaseAccounts?: InputMaybe<InvestmentListRelationFilter>;
	investmentIncomeAccounts?: InputMaybe<InvestmentListRelationFilter>;
	investmentUnrealizedAccounts?: InputMaybe<InvestmentListRelationFilter>;
	name?: InputMaybe<StringFilter>;
	realizedGlAccountAssets?: InputMaybe<AssetListRelationFilter>;
	system?: InputMaybe<BoolFilter>;
	tillerAccounts?: InputMaybe<TillerAccountNullableScalarRelationFilter>;
	unrealizedGlAccountAssets?: InputMaybe<AssetListRelationFilter>;
	updatedAt?: InputMaybe<DateTimeFilter>;
};

export type GlAccountWhereUniqueInput = {
	AND?: InputMaybe<Array<GlAccountWhereInput>>;
	NOT?: InputMaybe<Array<GlAccountWhereInput>>;
	OR?: InputMaybe<Array<GlAccountWhereInput>>;
	accountNumber?: InputMaybe<Scalars['Int']['input']>;
	id?: InputMaybe<Scalars['String']['input']>;
	name?: InputMaybe<Scalars['String']['input']>;
};

export type IncomeStatementAccountModel = {
	amounts: Array<PeriodAmountModel>;
	category: AccountTypeClass;
	name: Scalars['String']['output'];
};

export type IntFilter = {
	equals?: InputMaybe<Scalars['Int']['input']>;
	gt?: InputMaybe<Scalars['Int']['input']>;
	gte?: InputMaybe<Scalars['Int']['input']>;
	in?: InputMaybe<Array<Scalars['Int']['input']>>;
	lt?: InputMaybe<Scalars['Int']['input']>;
	lte?: InputMaybe<Scalars['Int']['input']>;
	not?: InputMaybe<NestedIntFilter>;
	notIn?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type IntNullableFilter = {
	equals?: InputMaybe<Scalars['Int']['input']>;
	gt?: InputMaybe<Scalars['Int']['input']>;
	gte?: InputMaybe<Scalars['Int']['input']>;
	in?: InputMaybe<Array<Scalars['Int']['input']>>;
	lt?: InputMaybe<Scalars['Int']['input']>;
	lte?: InputMaybe<Scalars['Int']['input']>;
	not?: InputMaybe<NestedIntNullableFilter>;
	notIn?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type Investment = {
	_count: InvestmentCount;
	accumulatedAccount: GlAccount;
	accumulatedAccountNumber: Scalars['Int']['output'];
	baseAccount: GlAccount;
	baseAccountNumber: Scalars['Int']['output'];
	createdAt: Scalars['DateTime']['output'];
	currentCost: Scalars['Int']['output'];
	id: Scalars['Int']['output'];
	incomeAccount: GlAccount;
	incomeAccountNumber: Scalars['Int']['output'];
	investmentChanges?: Maybe<Array<InvestmentChange>>;
	isRetirement: Scalars['Boolean']['output'];
	name: Scalars['String']['output'];
	netBookValue: Scalars['Int']['output'];
	originalOpenDate: Scalars['DateTime']['output'];
	originationDate: Scalars['DateTime']['output'];
	unrealizedAccount: GlAccount;
	unrealizedAccountNumber: Scalars['Int']['output'];
	updatedAt: Scalars['DateTime']['output'];
};

export type InvestmentChange = {
	amount: Scalars['Int']['output'];
	assetMonth: Scalars['Int']['output'];
	changeType: InvestmentChangeType;
	createdAt: Scalars['DateTime']['output'];
	effectiveDate: Scalars['DateTime']['output'];
	generatedJournal?: Maybe<Journal>;
	id: Scalars['Int']['output'];
	investment: Investment;
	investmentId: Scalars['Int']['output'];
	relatedEntryId?: Maybe<Scalars['Int']['output']>;
	relatedEntryLine?: Maybe<JournalEntry>;
	updatedAt: Scalars['DateTime']['output'];
};

export type InvestmentChangeActionResultModel = {
	amount: Scalars['Int']['output'];
	assetMonth: Scalars['Int']['output'];
	changeType: InvestmentChangeType;
	effectiveDate: Scalars['DateTime']['output'];
	generatedJournalNumber?: Maybe<Scalars['Int']['output']>;
	id: Scalars['Int']['output'];
	investmentId: Scalars['Int']['output'];
};

export type InvestmentChangeNullableScalarRelationFilter = {
	is?: InputMaybe<InvestmentChangeWhereInput>;
	isNot?: InputMaybe<InvestmentChangeWhereInput>;
};

export type InvestmentChangeOrderByWithRelationInput = {
	amount?: InputMaybe<SortOrder>;
	assetMonth?: InputMaybe<SortOrder>;
	changeType?: InputMaybe<SortOrder>;
	createdAt?: InputMaybe<SortOrder>;
	effectiveDate?: InputMaybe<SortOrder>;
	generatedJournal?: InputMaybe<JournalOrderByWithRelationInput>;
	id?: InputMaybe<SortOrder>;
	investment?: InputMaybe<InvestmentOrderByWithRelationInput>;
	investmentId?: InputMaybe<SortOrder>;
	relatedEntryId?: InputMaybe<SortOrderInput>;
	relatedEntryLine?: InputMaybe<JournalEntryOrderByWithRelationInput>;
	updatedAt?: InputMaybe<SortOrder>;
};

export type InvestmentChangeResultModel = {
	amount: Scalars['Int']['output'];
	assetMonth: Scalars['Int']['output'];
	changeType: InvestmentChangeType;
	effectiveDate: Scalars['DateTime']['output'];
	id: Scalars['Int']['output'];
	investmentId: Scalars['Int']['output'];
	relatedEntryId?: Maybe<Scalars['Int']['output']>;
};

export enum InvestmentChangeType {
	Deposit = 'Deposit',
	Dividend = 'Dividend',
	Expense = 'Expense',
	Revaluation = 'Revaluation',
	Withdrawal = 'Withdrawal'
}

export type InvestmentChangeWhereInput = {
	AND?: InputMaybe<Array<InvestmentChangeWhereInput>>;
	NOT?: InputMaybe<Array<InvestmentChangeWhereInput>>;
	OR?: InputMaybe<Array<InvestmentChangeWhereInput>>;
	amount?: InputMaybe<IntFilter>;
	assetMonth?: InputMaybe<IntFilter>;
	changeType?: InputMaybe<EnumInvestmentChangeTypeFilter>;
	createdAt?: InputMaybe<DateTimeFilter>;
	effectiveDate?: InputMaybe<DateTimeFilter>;
	generatedJournal?: InputMaybe<JournalNullableScalarRelationFilter>;
	id?: InputMaybe<IntFilter>;
	investment?: InputMaybe<InvestmentScalarRelationFilter>;
	investmentId?: InputMaybe<IntFilter>;
	relatedEntryId?: InputMaybe<IntNullableFilter>;
	relatedEntryLine?: InputMaybe<JournalEntryNullableScalarRelationFilter>;
	updatedAt?: InputMaybe<DateTimeFilter>;
};

export type InvestmentChangeWhereUniqueInput = {
	id?: InputMaybe<Scalars['Int']['input']>;
	relatedEntryId?: InputMaybe<Scalars['Int']['input']>;
};

export type InvestmentCount = {
	investmentChanges: Scalars['Int']['output'];
};

export type InvestmentCreateInput = {
	accumulatedAccountNumber: Scalars['Int']['input'];
	baseAccountNumber: Scalars['Int']['input'];
	incomeAccountNumber: Scalars['Int']['input'];
	isRetirement: Scalars['Boolean']['input'];
	name: Scalars['String']['input'];
	originalOpenDate: Scalars['DateTime']['input'];
	originationDate: Scalars['DateTime']['input'];
	unrealizedAccountNumber: Scalars['Int']['input'];
};

export type InvestmentListRelationFilter = {
	every?: InputMaybe<InvestmentWhereInput>;
	none?: InputMaybe<InvestmentWhereInput>;
	some?: InputMaybe<InvestmentWhereInput>;
};

export type InvestmentOrderByWithRelationInput = {
	accumulatedAccount?: InputMaybe<GlAccountOrderByWithRelationInput>;
	accumulatedAccountNumber?: InputMaybe<SortOrder>;
	baseAccount?: InputMaybe<GlAccountOrderByWithRelationInput>;
	baseAccountNumber?: InputMaybe<SortOrder>;
	createdAt?: InputMaybe<SortOrder>;
	currentCost?: InputMaybe<SortOrder>;
	id?: InputMaybe<SortOrder>;
	incomeAccount?: InputMaybe<GlAccountOrderByWithRelationInput>;
	incomeAccountNumber?: InputMaybe<SortOrder>;
	isRetirement?: InputMaybe<SortOrder>;
	name?: InputMaybe<SortOrder>;
	netBookValue?: InputMaybe<SortOrder>;
	originalOpenDate?: InputMaybe<SortOrder>;
	originationDate?: InputMaybe<SortOrder>;
	unrealizedAccount?: InputMaybe<GlAccountOrderByWithRelationInput>;
	unrealizedAccountNumber?: InputMaybe<SortOrder>;
	updatedAt?: InputMaybe<SortOrder>;
};

export type InvestmentResultModel = {
	_count: InvestmentCount;
	currentCost: Scalars['Int']['output'];
	id: Scalars['Int']['output'];
	isRetirement: Scalars['Boolean']['output'];
	name: Scalars['String']['output'];
	netBookValue: Scalars['Int']['output'];
	originalOpenDate: Scalars['DateTime']['output'];
	originationDate: Scalars['DateTime']['output'];
};

export type InvestmentScalarRelationFilter = {
	is?: InputMaybe<InvestmentWhereInput>;
	isNot?: InputMaybe<InvestmentWhereInput>;
};

export type InvestmentWhereInput = {
	AND?: InputMaybe<Array<InvestmentWhereInput>>;
	NOT?: InputMaybe<Array<InvestmentWhereInput>>;
	OR?: InputMaybe<Array<InvestmentWhereInput>>;
	accumulatedAccount?: InputMaybe<GlAccountScalarRelationFilter>;
	accumulatedAccountNumber?: InputMaybe<IntFilter>;
	baseAccount?: InputMaybe<GlAccountScalarRelationFilter>;
	baseAccountNumber?: InputMaybe<IntFilter>;
	createdAt?: InputMaybe<DateTimeFilter>;
	currentCost?: InputMaybe<IntFilter>;
	id?: InputMaybe<IntFilter>;
	incomeAccount?: InputMaybe<GlAccountScalarRelationFilter>;
	incomeAccountNumber?: InputMaybe<IntFilter>;
	isRetirement?: InputMaybe<BoolFilter>;
	name?: InputMaybe<StringFilter>;
	netBookValue?: InputMaybe<IntFilter>;
	originalOpenDate?: InputMaybe<DateTimeFilter>;
	originationDate?: InputMaybe<DateTimeFilter>;
	unrealizedAccount?: InputMaybe<GlAccountScalarRelationFilter>;
	unrealizedAccountNumber?: InputMaybe<IntFilter>;
	updatedAt?: InputMaybe<DateTimeFilter>;
};

export type InvestmentWhereUniqueInput = {
	id?: InputMaybe<Scalars['Int']['input']>;
	name?: InputMaybe<Scalars['String']['input']>;
};

export enum JobStatus {
	Completed = 'COMPLETED',
	Failed = 'FAILED',
	Pending = 'PENDING',
	Processing = 'PROCESSING'
}

export type Journal = {
	_count: JournalCount;
	book?: Maybe<Book>;
	bookId?: Maybe<Scalars['Int']['output']>;
	createdAt: Scalars['DateTime']['output'];
	createdFromTillerTran?: Maybe<TillerTran>;
	createdFromTillerTranId?: Maybe<Scalars['Int']['output']>;
	description: Scalars['String']['output'];
	entries?: Maybe<Array<JournalEntry>>;
	externalId?: Maybe<Scalars['String']['output']>;
	generatedFromAssetChange?: Maybe<AssetChange>;
	generatedFromAssetChangeId?: Maybe<Scalars['Int']['output']>;
	generatedFromInvestChange?: Maybe<InvestmentChange>;
	generatedFromLoanChange?: Maybe<LoanChange>;
	generatedFromLoanChangeId?: Maybe<Scalars['Int']['output']>;
	generatedFromScheduleLog?: Maybe<TranScheduleLog>;
	generatedFromScheduleLogId?: Maybe<Scalars['Int']['output']>;
	id: Scalars['String']['output'];
	idReversalOf?: Maybe<Scalars['String']['output']>;
	migrationLoanChanges?: Maybe<Array<LoanChange>>;
	postingMonth: Scalars['Int']['output'];
	postingPeriod: Period;
	postingYear: Scalars['Int']['output'];
	reversalDate?: Maybe<Scalars['DateTime']['output']>;
	reversalOf?: Maybe<Journal>;
	reversedTransaction?: Maybe<Journal>;
	templateForTranSchedules?: Maybe<Array<TranSchedule>>;
	tranDate: Scalars['DateTime']['output'];
	tranNumber: Scalars['Int']['output'];
	tranSource: SourceType;
	updatedAt: Scalars['DateTime']['output'];
};

export type JournalCount = {
	entries: Scalars['Int']['output'];
	migrationLoanChanges: Scalars['Int']['output'];
	templateForTranSchedules: Scalars['Int']['output'];
};

export type JournalCreateInput = {
	bookId?: InputMaybe<Scalars['Int']['input']>;
	createdFromTillerTranId?: InputMaybe<Scalars['Int']['input']>;
	description: Scalars['String']['input'];
	entries: Array<JournalEntryInput>;
	externalId?: InputMaybe<Scalars['String']['input']>;
	generatedFromAssetChangeId?: InputMaybe<Scalars['Int']['input']>;
	generatedFromLoanChangeId?: InputMaybe<Scalars['Int']['input']>;
	generatedFromScheduleLogId?: InputMaybe<Scalars['Int']['input']>;
	reversalDate?: InputMaybe<Scalars['DateTime']['input']>;
	tranDate: Scalars['DateTime']['input'];
	tranSource?: InputMaybe<SourceType>;
};

export type JournalEntry = {
	amount: Scalars['Int']['output'];
	createdAt: Scalars['DateTime']['output'];
	entity?: Maybe<Entity>;
	entityId?: Maybe<Scalars['Int']['output']>;
	entrySource: SourceType;
	glAccount: GlAccount;
	glAccountNumber: Scalars['Int']['output'];
	id: Scalars['Int']['output'];
	isDebit: Scalars['Boolean']['output'];
	journal: Journal;
	journalId: Scalars['String']['output'];
	memo: Scalars['String']['output'];
	originateAsset?: Maybe<Asset>;
	originateLoan?: Maybe<Loan>;
	relatedAssetChange?: Maybe<AssetChange>;
	relatedInvestmentChange?: Maybe<InvestmentChange>;
	updatedAt: Scalars['DateTime']['output'];
};

export type JournalEntryCountAggregate = {
	_all: Scalars['Int']['output'];
	amount: Scalars['Int']['output'];
	createdAt: Scalars['Int']['output'];
	entityId: Scalars['Int']['output'];
	entrySource: Scalars['Int']['output'];
	glAccountNumber: Scalars['Int']['output'];
	id: Scalars['Int']['output'];
	isDebit: Scalars['Int']['output'];
	journalId: Scalars['Int']['output'];
	memo: Scalars['Int']['output'];
	updatedAt: Scalars['Int']['output'];
};

export type JournalEntryInput = {
	amount: Scalars['Int']['input'];
	entityId?: InputMaybe<Scalars['Int']['input']>;
	entrySource?: InputMaybe<SourceType>;
	glAccountNumber: Scalars['Int']['input'];
	isDebit: Scalars['Boolean']['input'];
	memo: Scalars['String']['input'];
};

export type JournalEntryNullableScalarRelationFilter = {
	is?: InputMaybe<JournalEntryWhereInput>;
	isNot?: InputMaybe<JournalEntryWhereInput>;
};

export type JournalEntryOrderByWithRelationInput = {
	amount?: InputMaybe<SortOrder>;
	createdAt?: InputMaybe<SortOrder>;
	entity?: InputMaybe<EntityOrderByWithRelationInput>;
	entityId?: InputMaybe<SortOrderInput>;
	entrySource?: InputMaybe<SortOrder>;
	glAccount?: InputMaybe<GlAccountOrderByWithRelationInput>;
	glAccountNumber?: InputMaybe<SortOrder>;
	id?: InputMaybe<SortOrder>;
	isDebit?: InputMaybe<SortOrder>;
	journal?: InputMaybe<JournalOrderByWithRelationInput>;
	journalId?: InputMaybe<SortOrder>;
	memo?: InputMaybe<SortOrder>;
	updatedAt?: InputMaybe<SortOrder>;
};

export type JournalEntryScalarRelationFilter = {
	is?: InputMaybe<JournalEntryWhereInput>;
	isNot?: InputMaybe<JournalEntryWhereInput>;
};

export type JournalEntrySumAggregate = {
	amount?: Maybe<Scalars['Int']['output']>;
	entityId?: Maybe<Scalars['Int']['output']>;
	glAccountNumber?: Maybe<Scalars['Int']['output']>;
	id?: Maybe<Scalars['Int']['output']>;
};

export type JournalEntryWhereInput = {
	AND?: InputMaybe<Array<JournalEntryWhereInput>>;
	NOT?: InputMaybe<Array<JournalEntryWhereInput>>;
	OR?: InputMaybe<Array<JournalEntryWhereInput>>;
	amount?: InputMaybe<IntFilter>;
	createdAt?: InputMaybe<DateTimeFilter>;
	entity?: InputMaybe<EntityNullableScalarRelationFilter>;
	entityId?: InputMaybe<IntNullableFilter>;
	entrySource?: InputMaybe<EnumSourceTypeFilter>;
	glAccount?: InputMaybe<GlAccountScalarRelationFilter>;
	glAccountNumber?: InputMaybe<IntFilter>;
	id?: InputMaybe<IntFilter>;
	isDebit?: InputMaybe<BoolFilter>;
	journal?: InputMaybe<JournalScalarRelationFilter>;
	journalId?: InputMaybe<StringFilter>;
	memo?: InputMaybe<StringFilter>;
	originateAsset?: InputMaybe<AssetNullableScalarRelationFilter>;
	originateLoan?: InputMaybe<LoanNullableScalarRelationFilter>;
	relatedAssetChange?: InputMaybe<AssetChangeNullableScalarRelationFilter>;
	relatedInvestmentChange?: InputMaybe<InvestmentChangeNullableScalarRelationFilter>;
	updatedAt?: InputMaybe<DateTimeFilter>;
};

export type JournalEntryWhereUniqueInput = {
	id?: InputMaybe<Scalars['Int']['input']>;
};

export type JournalImportDataModel = {
	bookId?: Maybe<Scalars['Int']['output']>;
	description: Scalars['String']['output'];
	externalId: Scalars['String']['output'];
	reversalDate?: Maybe<Scalars['DateTime']['output']>;
	tranDate: Scalars['DateTime']['output'];
	tranSource?: Maybe<SourceType>;
};

export type JournalNullableScalarRelationFilter = {
	is?: InputMaybe<JournalWhereInput>;
	isNot?: InputMaybe<JournalWhereInput>;
};

export type JournalOrderByWithRelationInput = {
	book?: InputMaybe<BookOrderByWithRelationInput>;
	bookId?: InputMaybe<SortOrderInput>;
	createdAt?: InputMaybe<SortOrder>;
	createdFromTillerTran?: InputMaybe<TillerTranOrderByWithRelationInput>;
	createdFromTillerTranId?: InputMaybe<SortOrderInput>;
	description?: InputMaybe<SortOrder>;
	externalId?: InputMaybe<SortOrderInput>;
	generatedFromAssetChangeId?: InputMaybe<SortOrderInput>;
	generatedFromLoanChangeId?: InputMaybe<SortOrderInput>;
	id?: InputMaybe<SortOrder>;
	idReversalOf?: InputMaybe<SortOrderInput>;
	postingMonth?: InputMaybe<SortOrder>;
	postingPeriod?: InputMaybe<PeriodOrderByWithRelationInput>;
	postingYear?: InputMaybe<SortOrder>;
	reversalDate?: InputMaybe<SortOrderInput>;
	reversalOf?: InputMaybe<JournalOrderByWithRelationInput>;
	reversedTransaction?: InputMaybe<JournalOrderByWithRelationInput>;
	tranDate?: InputMaybe<SortOrder>;
	tranNumber?: InputMaybe<SortOrder>;
	tranSource?: InputMaybe<SortOrder>;
	updatedAt?: InputMaybe<SortOrder>;
};

export type JournalRecordImportJobModel = {
	data: JournalImportDataModel;
	externalId: Scalars['String']['output'];
	recordJobId: Scalars['String']['output'];
	recordType: Scalars['String']['output'];
};

export type JournalResultModel = {
	id: Scalars['String']['output'];
	tranNumber: Scalars['Int']['output'];
};

export type JournalScalarRelationFilter = {
	is?: InputMaybe<JournalWhereInput>;
	isNot?: InputMaybe<JournalWhereInput>;
};

export type JournalUpdateInput = {
	bookId?: InputMaybe<Scalars['Int']['input']>;
	description?: InputMaybe<Scalars['String']['input']>;
	entries?: InputMaybe<Array<UpdateJournalEntryInput>>;
	reversalDate?: InputMaybe<Scalars['DateTime']['input']>;
	tranDate?: InputMaybe<Scalars['DateTime']['input']>;
};

export type JournalWhereInput = {
	AND?: InputMaybe<Array<JournalWhereInput>>;
	NOT?: InputMaybe<Array<JournalWhereInput>>;
	OR?: InputMaybe<Array<JournalWhereInput>>;
	book?: InputMaybe<BookNullableScalarRelationFilter>;
	bookId?: InputMaybe<IntNullableFilter>;
	createdAt?: InputMaybe<DateTimeFilter>;
	createdFromTillerTran?: InputMaybe<TillerTranNullableScalarRelationFilter>;
	createdFromTillerTranId?: InputMaybe<IntNullableFilter>;
	description?: InputMaybe<StringFilter>;
	externalId?: InputMaybe<StringNullableFilter>;
	generatedFromAssetChange?: InputMaybe<AssetChangeNullableScalarRelationFilter>;
	generatedFromAssetChangeId?: InputMaybe<IntNullableFilter>;
	generatedFromInvestChange?: InputMaybe<InvestmentChangeNullableScalarRelationFilter>;
	generatedFromLoanChangeId?: InputMaybe<IntNullableFilter>;
	id?: InputMaybe<StringFilter>;
	idReversalOf?: InputMaybe<StringNullableFilter>;
	migrationLoanChanges?: InputMaybe<LoanChangeListRelationFilter>;
	postingMonth?: InputMaybe<IntFilter>;
	postingPeriod?: InputMaybe<PeriodScalarRelationFilter>;
	postingYear?: InputMaybe<IntFilter>;
	reversalDate?: InputMaybe<DateTimeNullableFilter>;
	reversalOf?: InputMaybe<JournalNullableScalarRelationFilter>;
	reversedTransaction?: InputMaybe<JournalNullableScalarRelationFilter>;
	tranDate?: InputMaybe<DateTimeFilter>;
	tranNumber?: InputMaybe<IntFilter>;
	tranSource?: InputMaybe<EnumSourceTypeFilter>;
	updatedAt?: InputMaybe<DateTimeFilter>;
};

export type JournalWhereUniqueInput = {
	createdFromTillerTranId?: InputMaybe<Scalars['Int']['input']>;
	externalId?: InputMaybe<Scalars['String']['input']>;
	generatedFromAssetChangeId?: InputMaybe<Scalars['Int']['input']>;
	generatedFromLoanChangeId?: InputMaybe<Scalars['Int']['input']>;
	id?: InputMaybe<Scalars['String']['input']>;
	idReversalOf?: InputMaybe<Scalars['String']['input']>;
	tranNumber?: InputMaybe<Scalars['Int']['input']>;
};

export type Loan = {
	_count: LoanCount;
	annualInterestRate: Scalars['Float']['output'];
	createdAt: Scalars['DateTime']['output'];
	entity: Entity;
	entityId: Scalars['Int']['output'];
	id: Scalars['Int']['output'];
	interestAccount: GlAccount;
	interestAccountNumber: Scalars['Int']['output'];
	loanChanges?: Maybe<Array<LoanChange>>;
	name: Scalars['String']['output'];
	originalAmount: Scalars['Int']['output'];
	originatingEntryId: Scalars['Int']['output'];
	originatingJournalEntry: JournalEntry;
	originationDate: Scalars['DateTime']['output'];
	payFromAccount: GlAccount;
	payFromAccountNumber: Scalars['Int']['output'];
	paymentStartDate: Scalars['DateTime']['output'];
	principalAccount: GlAccount;
	principalAccountNumber: Scalars['Int']['output'];
	termMonths: Scalars['Int']['output'];
	updatedAt: Scalars['DateTime']['output'];
};

export type LoanChange = {
	createdAt: Scalars['DateTime']['output'];
	effectiveDate: Scalars['DateTime']['output'];
	generatedJournal?: Maybe<Journal>;
	id: Scalars['Int']['output'];
	interestAmount: Scalars['Int']['output'];
	isForecast: Scalars['Boolean']['output'];
	loan: Loan;
	loanId: Scalars['Int']['output'];
	loanPeriod: Scalars['Int']['output'];
	migrationJournal?: Maybe<Journal>;
	migrationJournalId?: Maybe<Scalars['String']['output']>;
	paymentAmount: Scalars['Int']['output'];
	posted: Scalars['Boolean']['output'];
	principalAmount: Scalars['Int']['output'];
	system: Scalars['Boolean']['output'];
	updatedAt: Scalars['DateTime']['output'];
};

export type LoanChangeListRelationFilter = {
	every?: InputMaybe<LoanChangeWhereInput>;
	none?: InputMaybe<LoanChangeWhereInput>;
	some?: InputMaybe<LoanChangeWhereInput>;
};

export type LoanChangeLoanIdEffectiveDateCompoundUniqueInput = {
	effectiveDate: Scalars['DateTime']['input'];
	loanId: Scalars['Int']['input'];
};

export type LoanChangeLoanIdSystemLoanPeriodCompoundUniqueInput = {
	loanId: Scalars['Int']['input'];
	loanPeriod: Scalars['Int']['input'];
	system: Scalars['Boolean']['input'];
};

export type LoanChangeOrderByWithRelationInput = {
	createdAt?: InputMaybe<SortOrder>;
	effectiveDate?: InputMaybe<SortOrder>;
	generatedJournal?: InputMaybe<JournalOrderByWithRelationInput>;
	id?: InputMaybe<SortOrder>;
	interestAmount?: InputMaybe<SortOrder>;
	isForecast?: InputMaybe<SortOrder>;
	loan?: InputMaybe<LoanOrderByWithRelationInput>;
	loanId?: InputMaybe<SortOrder>;
	loanPeriod?: InputMaybe<SortOrder>;
	migrationJournal?: InputMaybe<JournalOrderByWithRelationInput>;
	migrationJournalId?: InputMaybe<SortOrderInput>;
	paymentAmount?: InputMaybe<SortOrder>;
	posted?: InputMaybe<SortOrder>;
	principalAmount?: InputMaybe<SortOrder>;
	system?: InputMaybe<SortOrder>;
	updatedAt?: InputMaybe<SortOrder>;
};

export type LoanChangeWhereInput = {
	AND?: InputMaybe<Array<LoanChangeWhereInput>>;
	NOT?: InputMaybe<Array<LoanChangeWhereInput>>;
	OR?: InputMaybe<Array<LoanChangeWhereInput>>;
	createdAt?: InputMaybe<DateTimeFilter>;
	effectiveDate?: InputMaybe<DateTimeFilter>;
	generatedJournal?: InputMaybe<JournalNullableScalarRelationFilter>;
	id?: InputMaybe<IntFilter>;
	interestAmount?: InputMaybe<IntFilter>;
	isForecast?: InputMaybe<BoolFilter>;
	loanId?: InputMaybe<IntFilter>;
	loanPeriod?: InputMaybe<IntFilter>;
	migrationJournal?: InputMaybe<JournalNullableScalarRelationFilter>;
	migrationJournalId?: InputMaybe<StringNullableFilter>;
	paymentAmount?: InputMaybe<IntFilter>;
	posted?: InputMaybe<BoolFilter>;
	principalAmount?: InputMaybe<IntFilter>;
	system?: InputMaybe<BoolFilter>;
	updatedAt?: InputMaybe<DateTimeFilter>;
};

export type LoanChangeWhereUniqueInput = {
	id?: InputMaybe<Scalars['Int']['input']>;
	loanId_effectiveDate?: InputMaybe<LoanChangeLoanIdEffectiveDateCompoundUniqueInput>;
	loanId_system_loanPeriod?: InputMaybe<LoanChangeLoanIdSystemLoanPeriodCompoundUniqueInput>;
};

export type LoanCount = {
	loanChanges: Scalars['Int']['output'];
};

export type LoanNullableScalarRelationFilter = {
	is?: InputMaybe<LoanWhereInput>;
	isNot?: InputMaybe<LoanWhereInput>;
};

export type LoanOrderByWithRelationInput = {
	annualInterestRate?: InputMaybe<SortOrder>;
	createdAt?: InputMaybe<SortOrder>;
	entity?: InputMaybe<EntityOrderByWithRelationInput>;
	entityId?: InputMaybe<SortOrder>;
	id?: InputMaybe<SortOrder>;
	interestAccount?: InputMaybe<GlAccountOrderByWithRelationInput>;
	interestAccountNumber?: InputMaybe<SortOrder>;
	name?: InputMaybe<SortOrder>;
	originalAmount?: InputMaybe<SortOrder>;
	originatingEntryId?: InputMaybe<SortOrder>;
	originatingJournalEntry?: InputMaybe<JournalEntryOrderByWithRelationInput>;
	originationDate?: InputMaybe<SortOrder>;
	payFromAccount?: InputMaybe<GlAccountOrderByWithRelationInput>;
	payFromAccountNumber?: InputMaybe<SortOrder>;
	paymentStartDate?: InputMaybe<SortOrder>;
	principalAccount?: InputMaybe<GlAccountOrderByWithRelationInput>;
	principalAccountNumber?: InputMaybe<SortOrder>;
	termMonths?: InputMaybe<SortOrder>;
	updatedAt?: InputMaybe<SortOrder>;
};

export type LoanResultModel = {
	_count: LoanCount;
	id: Scalars['Int']['output'];
	name: Scalars['String']['output'];
};

export type LoanWhereInput = {
	AND?: InputMaybe<Array<LoanWhereInput>>;
	NOT?: InputMaybe<Array<LoanWhereInput>>;
	OR?: InputMaybe<Array<LoanWhereInput>>;
	annualInterestRate?: InputMaybe<FloatFilter>;
	createdAt?: InputMaybe<DateTimeFilter>;
	entityId?: InputMaybe<IntFilter>;
	id?: InputMaybe<IntFilter>;
	interestAccount?: InputMaybe<GlAccountScalarRelationFilter>;
	interestAccountNumber?: InputMaybe<IntFilter>;
	name?: InputMaybe<StringFilter>;
	originalAmount?: InputMaybe<IntFilter>;
	originatingEntryId?: InputMaybe<IntFilter>;
	originatingJournalEntry?: InputMaybe<JournalEntryScalarRelationFilter>;
	originationDate?: InputMaybe<DateTimeFilter>;
	payFromAccount?: InputMaybe<GlAccountScalarRelationFilter>;
	payFromAccountNumber?: InputMaybe<IntFilter>;
	paymentStartDate?: InputMaybe<DateTimeFilter>;
	principalAccount?: InputMaybe<GlAccountScalarRelationFilter>;
	principalAccountNumber?: InputMaybe<IntFilter>;
	termMonths?: InputMaybe<IntFilter>;
	updatedAt?: InputMaybe<DateTimeFilter>;
};

export type LoanWhereUniqueInput = {
	id?: InputMaybe<Scalars['Int']['input']>;
	name?: InputMaybe<Scalars['String']['input']>;
	originatingEntryId?: InputMaybe<Scalars['Int']['input']>;
};

export type Mutation = {
	bulkUpdateScheduleLogs: CountResultModel;
	clearPeriods: CountResultModel;
	createAsset: AssetResultModel;
	createBook: Book;
	createEntity: Entity;
	createInvestment: InvestmentResultModel;
	createInvestmentChangeFromEntry: InvestmentChangeResultModel;
	createJournal: JournalResultModel;
	createLoan: LoanResultModel;
	createLoanMigrationEntry: CountResultModel;
	createTranSchedule: TranScheduleResultModel;
	genLogDates: CountResultModel;
	genScheduleLogJournal: TranScheduleLogResultModel;
	generatePeriods: CountResultModel;
	importJournals: RecordImportJob;
	lockPeriods: CountResultModel;
	removeAsset: AssetResultModel;
	removeBook: Book;
	removeEntity: Entity;
	removeInvestment: InvestmentResultModel;
	removeInvestmentChange: InvestmentChangeResultModel;
	removeLoan: LoanResultModel;
	removeTranSchedule: TranScheduleResultModel;
	revalueAssetChange: AssetChangeResultModel;
	revalueInvestmentChange: InvestmentChangeActionResultModel;
	runInvestmentValues: InvestmentResultModel;
	syncAssetValues: AssetValResultModel;
	unlockPeriods: CountResultModel;
	updateAsset: AssetResultModel;
	updateBook: Book;
	updateEntity: Entity;
	updateJournal: JournalResultModel;
	updateTranSchedule: TranScheduleResultModel;
};

export type MutationBulkUpdateScheduleLogsArgs = {
	data: TranScheduleLogUpdateManyMutationInput;
	where: TranScheduleLogWhereInput;
};

export type MutationClearPeriodsArgs = {
	fromYear: Scalars['Int']['input'];
};

export type MutationCreateAssetArgs = {
	data: CreateAssetInput;
};

export type MutationCreateBookArgs = {
	data: CreateBookInput;
};

export type MutationCreateEntityArgs = {
	data: CreateEntityInput;
};

export type MutationCreateInvestmentArgs = {
	dto: InvestmentCreateInput;
};

export type MutationCreateInvestmentChangeFromEntryArgs = {
	dto: FromEntryInvestmentChangeCreateInput;
	investmentId: Scalars['Int']['input'];
};

export type MutationCreateJournalArgs = {
	data: JournalCreateInput;
};

export type MutationCreateLoanArgs = {
	data: CreateLoanInput;
};

export type MutationCreateLoanMigrationEntryArgs = {
	data: CreateLoanMigrationJournalInput;
};

export type MutationCreateTranScheduleArgs = {
	dto: TranScheduleCreateInput;
	genToDate?: InputMaybe<Scalars['DateTime']['input']>;
	templateJournalId: Scalars['String']['input'];
};

export type MutationGenLogDatesArgs = {
	generateUpToDate: Scalars['DateTime']['input'];
	where: TranScheduleWhereInput;
};

export type MutationGenScheduleLogJournalArgs = {
	where: TranScheduleLogWhereUniqueInput;
};

export type MutationGeneratePeriodsArgs = {
	toYear: Scalars['Int']['input'];
};

export type MutationImportJournalsArgs = {
	records: Array<JournalCreateInput>;
};

export type MutationLockPeriodsArgs = {
	where: PeriodWhereUniqueInput;
};

export type MutationRemoveAssetArgs = {
	where: AssetWhereUniqueInput;
};

export type MutationRemoveBookArgs = {
	id: Scalars['Int']['input'];
};

export type MutationRemoveEntityArgs = {
	id: Scalars['Int']['input'];
};

export type MutationRemoveInvestmentArgs = {
	where: InvestmentWhereUniqueInput;
};

export type MutationRemoveInvestmentChangeArgs = {
	where: InvestmentChangeWhereUniqueInput;
};

export type MutationRemoveLoanArgs = {
	where: LoanWhereUniqueInput;
};

export type MutationRemoveTranScheduleArgs = {
	where: TranScheduleWhereUniqueInput;
};

export type MutationRevalueAssetChangeArgs = {
	data: RevalAssetChangeInput;
	useFirstOpenPeriod: Scalars['Boolean']['input'];
};

export type MutationRevalueInvestmentChangeArgs = {
	dto: RevalInvestmentChangeInput;
	generatePosting: Scalars['Boolean']['input'];
	useFirstOpenPeriod: Scalars['Boolean']['input'];
};

export type MutationRunInvestmentValuesArgs = {
	where: InvestmentWhereUniqueInput;
};

export type MutationSyncAssetValuesArgs = {
	where: AssetWhereUniqueInput;
};

export type MutationUnlockPeriodsArgs = {
	where: PeriodWhereUniqueInput;
};

export type MutationUpdateAssetArgs = {
	data: AssetUpdateInput;
	where: AssetWhereUniqueInput;
};

export type MutationUpdateBookArgs = {
	data: UpdateBookInput;
	where: BookWhereUniqueInput;
};

export type MutationUpdateEntityArgs = {
	data: UpdateEntityInput;
	where: EntityWhereUniqueInput;
};

export type MutationUpdateJournalArgs = {
	dto: JournalUpdateInput;
	where: JournalWhereUniqueInput;
};

export type MutationUpdateTranScheduleArgs = {
	dto: TranScheduleUpdateInput;
	where: TranScheduleWhereUniqueInput;
};

export type NestedBoolFilter = {
	equals?: InputMaybe<Scalars['Boolean']['input']>;
	not?: InputMaybe<NestedBoolFilter>;
};

export type NestedDateTimeFilter = {
	equals?: InputMaybe<Scalars['DateTime']['input']>;
	gt?: InputMaybe<Scalars['DateTime']['input']>;
	gte?: InputMaybe<Scalars['DateTime']['input']>;
	in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
	lt?: InputMaybe<Scalars['DateTime']['input']>;
	lte?: InputMaybe<Scalars['DateTime']['input']>;
	not?: InputMaybe<NestedDateTimeFilter>;
	notIn?: InputMaybe<Array<Scalars['DateTime']['input']>>;
};

export type NestedDateTimeNullableFilter = {
	equals?: InputMaybe<Scalars['DateTime']['input']>;
	gt?: InputMaybe<Scalars['DateTime']['input']>;
	gte?: InputMaybe<Scalars['DateTime']['input']>;
	in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
	lt?: InputMaybe<Scalars['DateTime']['input']>;
	lte?: InputMaybe<Scalars['DateTime']['input']>;
	not?: InputMaybe<NestedDateTimeNullableFilter>;
	notIn?: InputMaybe<Array<Scalars['DateTime']['input']>>;
};

export type NestedEnumAccountTypeClassFilter = {
	equals?: InputMaybe<AccountTypeClass>;
	in?: InputMaybe<Array<AccountTypeClass>>;
	not?: InputMaybe<NestedEnumAccountTypeClassFilter>;
	notIn?: InputMaybe<Array<AccountTypeClass>>;
};

export type NestedEnumAssetCategoryFilter = {
	equals?: InputMaybe<AssetCategory>;
	in?: InputMaybe<Array<AssetCategory>>;
	not?: InputMaybe<NestedEnumAssetCategoryFilter>;
	notIn?: InputMaybe<Array<AssetCategory>>;
};

export type NestedEnumAssetChangeTypeFilter = {
	equals?: InputMaybe<AssetChangeType>;
	in?: InputMaybe<Array<AssetChangeType>>;
	not?: InputMaybe<NestedEnumAssetChangeTypeFilter>;
	notIn?: InputMaybe<Array<AssetChangeType>>;
};

export type NestedEnumAssetStatusFilter = {
	equals?: InputMaybe<AssetStatus>;
	in?: InputMaybe<Array<AssetStatus>>;
	not?: InputMaybe<NestedEnumAssetStatusFilter>;
	notIn?: InputMaybe<Array<AssetStatus>>;
};

export type NestedEnumEntityTypeFilter = {
	equals?: InputMaybe<EntityType>;
	in?: InputMaybe<Array<EntityType>>;
	not?: InputMaybe<NestedEnumEntityTypeFilter>;
	notIn?: InputMaybe<Array<EntityType>>;
};

export type NestedEnumGenerationStatusFilter = {
	equals?: InputMaybe<GenerationStatus>;
	in?: InputMaybe<Array<GenerationStatus>>;
	not?: InputMaybe<NestedEnumGenerationStatusFilter>;
	notIn?: InputMaybe<Array<GenerationStatus>>;
};

export type NestedEnumInvestmentChangeTypeFilter = {
	equals?: InputMaybe<InvestmentChangeType>;
	in?: InputMaybe<Array<InvestmentChangeType>>;
	not?: InputMaybe<NestedEnumInvestmentChangeTypeFilter>;
	notIn?: InputMaybe<Array<InvestmentChangeType>>;
};

export type NestedEnumJobStatusFilter = {
	equals?: InputMaybe<JobStatus>;
	in?: InputMaybe<Array<JobStatus>>;
	not?: InputMaybe<NestedEnumJobStatusFilter>;
	notIn?: InputMaybe<Array<JobStatus>>;
};

export type NestedEnumRecurrenceFrequencyFilter = {
	equals?: InputMaybe<RecurrenceFrequency>;
	in?: InputMaybe<Array<RecurrenceFrequency>>;
	not?: InputMaybe<NestedEnumRecurrenceFrequencyFilter>;
	notIn?: InputMaybe<Array<RecurrenceFrequency>>;
};

export type NestedEnumRoleFilter = {
	equals?: InputMaybe<Role>;
	in?: InputMaybe<Array<Role>>;
	not?: InputMaybe<NestedEnumRoleFilter>;
	notIn?: InputMaybe<Array<Role>>;
};

export type NestedEnumSourceTypeFilter = {
	equals?: InputMaybe<SourceType>;
	in?: InputMaybe<Array<SourceType>>;
	not?: InputMaybe<NestedEnumSourceTypeFilter>;
	notIn?: InputMaybe<Array<SourceType>>;
};

export type NestedEnumTillerCategoryTypeFilter = {
	equals?: InputMaybe<TillerCategoryType>;
	in?: InputMaybe<Array<TillerCategoryType>>;
	not?: InputMaybe<NestedEnumTillerCategoryTypeFilter>;
	notIn?: InputMaybe<Array<TillerCategoryType>>;
};

export type NestedEnumWeekdayNullableFilter = {
	equals?: InputMaybe<Weekday>;
	in?: InputMaybe<Array<Weekday>>;
	not?: InputMaybe<NestedEnumWeekdayNullableFilter>;
	notIn?: InputMaybe<Array<Weekday>>;
};

export type NestedFloatFilter = {
	equals?: InputMaybe<Scalars['Float']['input']>;
	gt?: InputMaybe<Scalars['Float']['input']>;
	gte?: InputMaybe<Scalars['Float']['input']>;
	in?: InputMaybe<Array<Scalars['Float']['input']>>;
	lt?: InputMaybe<Scalars['Float']['input']>;
	lte?: InputMaybe<Scalars['Float']['input']>;
	not?: InputMaybe<NestedFloatFilter>;
	notIn?: InputMaybe<Array<Scalars['Float']['input']>>;
};

export type NestedIntFilter = {
	equals?: InputMaybe<Scalars['Int']['input']>;
	gt?: InputMaybe<Scalars['Int']['input']>;
	gte?: InputMaybe<Scalars['Int']['input']>;
	in?: InputMaybe<Array<Scalars['Int']['input']>>;
	lt?: InputMaybe<Scalars['Int']['input']>;
	lte?: InputMaybe<Scalars['Int']['input']>;
	not?: InputMaybe<NestedIntFilter>;
	notIn?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type NestedIntNullableFilter = {
	equals?: InputMaybe<Scalars['Int']['input']>;
	gt?: InputMaybe<Scalars['Int']['input']>;
	gte?: InputMaybe<Scalars['Int']['input']>;
	in?: InputMaybe<Array<Scalars['Int']['input']>>;
	lt?: InputMaybe<Scalars['Int']['input']>;
	lte?: InputMaybe<Scalars['Int']['input']>;
	not?: InputMaybe<NestedIntNullableFilter>;
	notIn?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type NestedStringFilter = {
	contains?: InputMaybe<Scalars['String']['input']>;
	endsWith?: InputMaybe<Scalars['String']['input']>;
	equals?: InputMaybe<Scalars['String']['input']>;
	gt?: InputMaybe<Scalars['String']['input']>;
	gte?: InputMaybe<Scalars['String']['input']>;
	in?: InputMaybe<Array<Scalars['String']['input']>>;
	lt?: InputMaybe<Scalars['String']['input']>;
	lte?: InputMaybe<Scalars['String']['input']>;
	not?: InputMaybe<NestedStringFilter>;
	notIn?: InputMaybe<Array<Scalars['String']['input']>>;
	startsWith?: InputMaybe<Scalars['String']['input']>;
};

export type NestedStringNullableFilter = {
	contains?: InputMaybe<Scalars['String']['input']>;
	endsWith?: InputMaybe<Scalars['String']['input']>;
	equals?: InputMaybe<Scalars['String']['input']>;
	gt?: InputMaybe<Scalars['String']['input']>;
	gte?: InputMaybe<Scalars['String']['input']>;
	in?: InputMaybe<Array<Scalars['String']['input']>>;
	lt?: InputMaybe<Scalars['String']['input']>;
	lte?: InputMaybe<Scalars['String']['input']>;
	not?: InputMaybe<NestedStringNullableFilter>;
	notIn?: InputMaybe<Array<Scalars['String']['input']>>;
	startsWith?: InputMaybe<Scalars['String']['input']>;
};

export enum NullsOrder {
	First = 'first',
	Last = 'last'
}

export type Period = {
	_count: PeriodCount;
	createdAt: Scalars['DateTime']['output'];
	endDate: Scalars['DateTime']['output'];
	id: Scalars['Int']['output'];
	journals?: Maybe<Array<Journal>>;
	label: Scalars['String']['output'];
	lastDay: Scalars['Int']['output'];
	locked: Scalars['Boolean']['output'];
	month: Scalars['Int']['output'];
	quarter: Scalars['Int']['output'];
	startDate: Scalars['DateTime']['output'];
	updatedAt: Scalars['DateTime']['output'];
	year: Scalars['Int']['output'];
};

export type PeriodAmountModel = {
	amount: Scalars['Int']['output'];
	period: Scalars['String']['output'];
	periodId: Scalars['Int']['output'];
};

export type PeriodCount = {
	journals: Scalars['Int']['output'];
};

export type PeriodOrderByWithRelationInput = {
	createdAt?: InputMaybe<SortOrder>;
	endDate?: InputMaybe<SortOrder>;
	id?: InputMaybe<SortOrder>;
	label?: InputMaybe<SortOrder>;
	lastDay?: InputMaybe<SortOrder>;
	locked?: InputMaybe<SortOrder>;
	month?: InputMaybe<SortOrder>;
	quarter?: InputMaybe<SortOrder>;
	startDate?: InputMaybe<SortOrder>;
	updatedAt?: InputMaybe<SortOrder>;
	year?: InputMaybe<SortOrder>;
};

export type PeriodRangeAccountModel = {
	accountTypeClass: AccountTypeClass;
	accountTypeName: Scalars['String']['output'];
	accountTypeSortOrder: Scalars['Int']['output'];
	entries: Array<ReportPeriodRangeAmountModel>;
	glAccountId: Scalars['String']['output'];
	glAccountLabel: Scalars['String']['output'];
	glAccountName: Scalars['String']['output'];
	glAccountNumber: Scalars['Int']['output'];
	totalAmount: Scalars['Int']['output'];
	totalBalance: Scalars['Int']['output'];
	totalCredits: Scalars['Int']['output'];
	totalDebits: Scalars['Int']['output'];
	totalEntries: Scalars['Int']['output'];
};

export type PeriodRangeEntryModel = {
	accountTypeClass: AccountTypeClass;
	accountTypeName: Scalars['String']['output'];
	accountTypeSortOrder: Scalars['Int']['output'];
	credits: Scalars['Int']['output'];
	debits: Scalars['Int']['output'];
	entryCount: Scalars['Int']['output'];
	glAccountName: Scalars['String']['output'];
	glAccountNumber: Scalars['Int']['output'];
	periodId: Scalars['Int']['output'];
	periodLabel: Scalars['String']['output'];
	periodMonth: Scalars['Int']['output'];
	periodYear: Scalars['Int']['output'];
};

export type PeriodScalarRelationFilter = {
	is?: InputMaybe<PeriodWhereInput>;
	isNot?: InputMaybe<PeriodWhereInput>;
};

export type PeriodWhereInput = {
	AND?: InputMaybe<Array<PeriodWhereInput>>;
	NOT?: InputMaybe<Array<PeriodWhereInput>>;
	OR?: InputMaybe<Array<PeriodWhereInput>>;
	createdAt?: InputMaybe<DateTimeFilter>;
	endDate?: InputMaybe<DateTimeFilter>;
	id?: InputMaybe<IntFilter>;
	label?: InputMaybe<StringFilter>;
	lastDay?: InputMaybe<IntFilter>;
	locked?: InputMaybe<BoolFilter>;
	month?: InputMaybe<IntFilter>;
	quarter?: InputMaybe<IntFilter>;
	startDate?: InputMaybe<DateTimeFilter>;
	updatedAt?: InputMaybe<DateTimeFilter>;
	year?: InputMaybe<IntFilter>;
};

export type PeriodWhereUniqueInput = {
	endDate?: InputMaybe<Scalars['DateTime']['input']>;
	id?: InputMaybe<Scalars['Int']['input']>;
	label?: InputMaybe<Scalars['String']['input']>;
	startDate?: InputMaybe<Scalars['DateTime']['input']>;
	year_month?: InputMaybe<PeriodYearMonthCompoundUniqueInput>;
};

export type PeriodYearMonthCompoundUniqueInput = {
	month: Scalars['Int']['input'];
	year: Scalars['Int']['input'];
};

export type Query = {
	asset: Asset;
	assetChange: AssetChange;
	assetChanges: Array<AssetChange>;
	assets: Array<Asset>;
	book: Book;
	books: Array<Book>;
	bulkImportJobSubmission: BulkImportJobSubmission;
	bulkImportJobSubmissions: Array<BulkImportJobSubmission>;
	bulkImportRecord: BulkImportRecord;
	bulkImportRecords: Array<BulkImportRecord>;
	countJournalEntries: Scalars['Int']['output'];
	entities: Array<Entity>;
	entity: Entity;
	getAsOfBalanceSheet: Array<AsOfReportEntryModel>;
	getAsOfReport: Array<AsOfReportEntryModel>;
	getImportPending: Array<JournalRecordImportJobModel>;
	getIncomeStatement: Array<IncomeStatementAccountModel>;
	getPeriodAccounts: Array<PeriodRangeAccountModel>;
	getRangeReport: Array<PeriodRangeEntryModel>;
	glAccount: GlAccount;
	glAccountType: GlAccountType;
	glAccountTypes: Array<GlAccountType>;
	glAccounts: Array<GlAccount>;
	investment: Investment;
	investmentChange: InvestmentChange;
	investmentChanges: Array<InvestmentChange>;
	investments: Array<Investment>;
	journal: Journal;
	journalEntries: Array<JournalEntry>;
	journalEntry: JournalEntry;
	journals: Array<Journal>;
	loan: Loan;
	loanChange: LoanChange;
	loanChanges: Array<LoanChange>;
	loans: Array<Loan>;
	period: Period;
	periods: Array<Period>;
	recordImportJob: RecordImportJob;
	recordImportJobs: Array<RecordImportJob>;
	runAsOfReport: Array<AsOfReportEntryModel>;
	tillerAccount: TillerAccount;
	tillerAccounts: Array<TillerAccount>;
	tillerCategories: Array<TillerCategory>;
	tillerCategory: TillerCategory;
	tillerTran: TillerTran;
	tillerTrans: Array<TillerTran>;
	tranSchedule: TranSchedule;
	tranScheduleLog: TranScheduleLog;
	tranScheduleLogs: Array<TranScheduleLog>;
	tranSchedules: Array<TranSchedule>;
	users: Array<UserModel>;
};

export type QueryAssetArgs = {
	where: AssetWhereUniqueInput;
};

export type QueryAssetChangeArgs = {
	where: AssetChangeWhereUniqueInput;
};

export type QueryAssetChangesArgs = {
	cursor?: InputMaybe<AssetChangeWhereUniqueInput>;
	orderBy?: InputMaybe<Array<AssetChangeOrderByWithRelationInput>>;
	skip?: InputMaybe<Scalars['Int']['input']>;
	take?: InputMaybe<Scalars['Int']['input']>;
	where?: InputMaybe<AssetChangeWhereInput>;
};

export type QueryAssetsArgs = {
	cursor?: InputMaybe<AssetWhereUniqueInput>;
	orderBy?: InputMaybe<Array<AssetOrderByWithRelationInput>>;
	skip?: InputMaybe<Scalars['Int']['input']>;
	take?: InputMaybe<Scalars['Int']['input']>;
	where?: InputMaybe<AssetWhereInput>;
};

export type QueryBookArgs = {
	where: BookWhereUniqueInput;
};

export type QueryBooksArgs = {
	cursor?: InputMaybe<BookWhereUniqueInput>;
	orderBy?: InputMaybe<Array<BookOrderByWithRelationInput>>;
	skip?: InputMaybe<Scalars['Int']['input']>;
	take?: InputMaybe<Scalars['Int']['input']>;
	where?: InputMaybe<BookWhereInput>;
};

export type QueryBulkImportJobSubmissionArgs = {
	where: BulkImportJobSubmissionWhereUniqueInput;
};

export type QueryBulkImportJobSubmissionsArgs = {
	cursor?: InputMaybe<BulkImportJobSubmissionWhereUniqueInput>;
	orderBy?: InputMaybe<Array<BulkImportJobSubmissionOrderByWithRelationInput>>;
	skip?: InputMaybe<Scalars['Int']['input']>;
	take?: InputMaybe<Scalars['Int']['input']>;
	where?: InputMaybe<BulkImportJobSubmissionWhereInput>;
};

export type QueryBulkImportRecordArgs = {
	where: BulkImportRecordWhereUniqueInput;
};

export type QueryBulkImportRecordsArgs = {
	cursor?: InputMaybe<BulkImportRecordWhereUniqueInput>;
	orderBy?: InputMaybe<Array<BulkImportRecordOrderByWithRelationInput>>;
	skip?: InputMaybe<Scalars['Int']['input']>;
	take?: InputMaybe<Scalars['Int']['input']>;
	where?: InputMaybe<BulkImportRecordWhereInput>;
};

export type QueryCountJournalEntriesArgs = {
	where?: InputMaybe<JournalEntryWhereInput>;
};

export type QueryEntitiesArgs = {
	cursor?: InputMaybe<EntityWhereUniqueInput>;
	orderBy?: InputMaybe<Array<EntityOrderByWithRelationInput>>;
	skip?: InputMaybe<Scalars['Int']['input']>;
	take?: InputMaybe<Scalars['Int']['input']>;
	where?: InputMaybe<EntityWhereInput>;
};

export type QueryEntityArgs = {
	where: EntityWhereUniqueInput;
};

export type QueryGetAsOfBalanceSheetArgs = {
	asOfPeriod: PeriodWhereUniqueInput;
};

export type QueryGetAsOfReportArgs = {
	asOfPeriod: PeriodWhereUniqueInput;
};

export type QueryGetIncomeStatementArgs = {
	bookWhere?: InputMaybe<BookWhereInput>;
	glAccwhere?: InputMaybe<GlAccountWhereInput>;
	periodWhere: PeriodWhereInput;
};

export type QueryGetPeriodAccountsArgs = {
	bookWhere?: InputMaybe<BookWhereInput>;
	glAccwhere?: InputMaybe<GlAccountWhereInput>;
	periodWhere: PeriodWhereInput;
};

export type QueryGetRangeReportArgs = {
	bookWhere?: InputMaybe<BookWhereInput>;
	glAccwhere?: InputMaybe<GlAccountWhereInput>;
	periodWhere: PeriodWhereInput;
};

export type QueryGlAccountArgs = {
	where: GlAccountWhereUniqueInput;
};

export type QueryGlAccountTypeArgs = {
	where: GlAccountTypeWhereUniqueInput;
};

export type QueryGlAccountTypesArgs = {
	cursor?: InputMaybe<GlAccountTypeWhereUniqueInput>;
	orderBy?: InputMaybe<Array<GlAccountTypeOrderByWithRelationInput>>;
	skip?: InputMaybe<Scalars['Int']['input']>;
	take?: InputMaybe<Scalars['Int']['input']>;
	where?: InputMaybe<GlAccountTypeWhereInput>;
};

export type QueryGlAccountsArgs = {
	cursor?: InputMaybe<GlAccountWhereUniqueInput>;
	orderBy?: InputMaybe<Array<GlAccountOrderByWithRelationInput>>;
	skip?: InputMaybe<Scalars['Int']['input']>;
	take?: InputMaybe<Scalars['Int']['input']>;
	where?: InputMaybe<GlAccountWhereInput>;
};

export type QueryInvestmentArgs = {
	where: InvestmentWhereUniqueInput;
};

export type QueryInvestmentChangeArgs = {
	where: InvestmentChangeWhereUniqueInput;
};

export type QueryInvestmentChangesArgs = {
	cursor?: InputMaybe<InvestmentChangeWhereUniqueInput>;
	orderBy?: InputMaybe<Array<InvestmentChangeOrderByWithRelationInput>>;
	skip?: InputMaybe<Scalars['Int']['input']>;
	take?: InputMaybe<Scalars['Int']['input']>;
	where?: InputMaybe<InvestmentChangeWhereInput>;
};

export type QueryInvestmentsArgs = {
	cursor?: InputMaybe<InvestmentWhereUniqueInput>;
	orderBy?: InputMaybe<Array<InvestmentOrderByWithRelationInput>>;
	skip?: InputMaybe<Scalars['Int']['input']>;
	take?: InputMaybe<Scalars['Int']['input']>;
	where?: InputMaybe<InvestmentWhereInput>;
};

export type QueryJournalArgs = {
	where: JournalWhereUniqueInput;
};

export type QueryJournalEntriesArgs = {
	cursor?: InputMaybe<JournalEntryWhereUniqueInput>;
	orderBy?: InputMaybe<Array<JournalEntryOrderByWithRelationInput>>;
	skip?: InputMaybe<Scalars['Int']['input']>;
	take?: InputMaybe<Scalars['Int']['input']>;
	where?: InputMaybe<JournalEntryWhereInput>;
};

export type QueryJournalEntryArgs = {
	where: JournalEntryWhereUniqueInput;
};

export type QueryJournalsArgs = {
	cursor?: InputMaybe<JournalWhereUniqueInput>;
	orderBy?: InputMaybe<Array<JournalOrderByWithRelationInput>>;
	skip?: InputMaybe<Scalars['Int']['input']>;
	take?: InputMaybe<Scalars['Int']['input']>;
	where?: InputMaybe<JournalWhereInput>;
};

export type QueryLoanArgs = {
	where: LoanWhereUniqueInput;
};

export type QueryLoanChangeArgs = {
	where: LoanChangeWhereUniqueInput;
};

export type QueryLoanChangesArgs = {
	cursor?: InputMaybe<LoanChangeWhereUniqueInput>;
	orderBy?: InputMaybe<Array<LoanChangeOrderByWithRelationInput>>;
	skip?: InputMaybe<Scalars['Int']['input']>;
	take?: InputMaybe<Scalars['Int']['input']>;
	where?: InputMaybe<LoanChangeWhereInput>;
};

export type QueryLoansArgs = {
	cursor?: InputMaybe<LoanWhereUniqueInput>;
	orderBy?: InputMaybe<Array<LoanOrderByWithRelationInput>>;
	skip?: InputMaybe<Scalars['Int']['input']>;
	take?: InputMaybe<Scalars['Int']['input']>;
	where?: InputMaybe<LoanWhereInput>;
};

export type QueryPeriodArgs = {
	where: PeriodWhereUniqueInput;
};

export type QueryPeriodsArgs = {
	cursor?: InputMaybe<PeriodWhereUniqueInput>;
	orderBy?: InputMaybe<Array<PeriodOrderByWithRelationInput>>;
	skip?: InputMaybe<Scalars['Int']['input']>;
	take?: InputMaybe<Scalars['Int']['input']>;
	where?: InputMaybe<PeriodWhereInput>;
};

export type QueryRecordImportJobArgs = {
	where: RecordImportJobWhereUniqueInput;
};

export type QueryRecordImportJobsArgs = {
	cursor?: InputMaybe<RecordImportJobWhereUniqueInput>;
	orderBy?: InputMaybe<Array<RecordImportJobOrderByWithRelationInput>>;
	skip?: InputMaybe<Scalars['Int']['input']>;
	take?: InputMaybe<Scalars['Int']['input']>;
	where?: InputMaybe<RecordImportJobWhereInput>;
};

export type QueryRunAsOfReportArgs = {
	bookWhere?: InputMaybe<BookWhereInput>;
	glAccwhere?: InputMaybe<GlAccountWhereInput>;
	periodWhere: PeriodWhereUniqueInput;
};

export type QueryTillerAccountArgs = {
	where: TillerAccountWhereUniqueInput;
};

export type QueryTillerAccountsArgs = {
	cursor?: InputMaybe<TillerAccountWhereUniqueInput>;
	orderBy?: InputMaybe<Array<TillerAccountOrderByWithRelationInput>>;
	skip?: InputMaybe<Scalars['Int']['input']>;
	take?: InputMaybe<Scalars['Int']['input']>;
	where?: InputMaybe<TillerAccountWhereInput>;
};

export type QueryTillerCategoriesArgs = {
	cursor?: InputMaybe<TillerCategoryWhereUniqueInput>;
	orderBy?: InputMaybe<Array<TillerCategoryOrderByWithRelationInput>>;
	skip?: InputMaybe<Scalars['Int']['input']>;
	take?: InputMaybe<Scalars['Int']['input']>;
	where?: InputMaybe<TillerCategoryWhereInput>;
};

export type QueryTillerCategoryArgs = {
	where: TillerCategoryWhereUniqueInput;
};

export type QueryTillerTranArgs = {
	where: TillerTranWhereUniqueInput;
};

export type QueryTillerTransArgs = {
	cursor?: InputMaybe<TillerTranWhereUniqueInput>;
	orderBy?: InputMaybe<Array<TillerTranOrderByWithRelationInput>>;
	skip?: InputMaybe<Scalars['Int']['input']>;
	take?: InputMaybe<Scalars['Int']['input']>;
	where?: InputMaybe<TillerTranWhereInput>;
};

export type QueryTranScheduleArgs = {
	where: TranScheduleWhereUniqueInput;
};

export type QueryTranScheduleLogArgs = {
	where: TranScheduleLogWhereUniqueInput;
};

export type QueryTranScheduleLogsArgs = {
	cursor?: InputMaybe<TranScheduleLogWhereUniqueInput>;
	orderBy?: InputMaybe<Array<TranScheduleLogOrderByWithRelationInput>>;
	skip?: InputMaybe<Scalars['Int']['input']>;
	take?: InputMaybe<Scalars['Int']['input']>;
	where?: InputMaybe<TranScheduleLogWhereInput>;
};

export type QueryTranSchedulesArgs = {
	cursor?: InputMaybe<TranScheduleWhereUniqueInput>;
	orderBy?: InputMaybe<Array<TranScheduleOrderByWithRelationInput>>;
	skip?: InputMaybe<Scalars['Int']['input']>;
	take?: InputMaybe<Scalars['Int']['input']>;
	where?: InputMaybe<TranScheduleWhereInput>;
};

export type QueryUsersArgs = {
	cursor?: InputMaybe<UserWhereUniqueInput>;
	orderBy?: InputMaybe<Array<UserOrderByWithRelationInput>>;
	skip?: InputMaybe<Scalars['Int']['input']>;
	take?: InputMaybe<Scalars['Int']['input']>;
	where?: InputMaybe<UserWhereInput>;
};

export enum QueryMode {
	Default = 'default',
	Insensitive = 'insensitive'
}

export type RecordImportJob = {
	createdAt: Scalars['DateTime']['output'];
	failed: Scalars['Int']['output'];
	finishedAt?: Maybe<Scalars['DateTime']['output']>;
	id: Scalars['String']['output'];
	recordTotal: Scalars['Int']['output'];
	recordType: Scalars['String']['output'];
	startedAt?: Maybe<Scalars['DateTime']['output']>;
	status: JobStatus;
	success: Scalars['Int']['output'];
	updatedAt: Scalars['DateTime']['output'];
};

export type RecordImportJobOrderByWithRelationInput = {
	createdAt?: InputMaybe<SortOrder>;
	failed?: InputMaybe<SortOrder>;
	finishedAt?: InputMaybe<SortOrderInput>;
	id?: InputMaybe<SortOrder>;
	recordTotal?: InputMaybe<SortOrder>;
	recordType?: InputMaybe<SortOrder>;
	startedAt?: InputMaybe<SortOrderInput>;
	status?: InputMaybe<SortOrder>;
	success?: InputMaybe<SortOrder>;
	updatedAt?: InputMaybe<SortOrder>;
};

export type RecordImportJobWhereInput = {
	AND?: InputMaybe<Array<RecordImportJobWhereInput>>;
	NOT?: InputMaybe<Array<RecordImportJobWhereInput>>;
	OR?: InputMaybe<Array<RecordImportJobWhereInput>>;
	createdAt?: InputMaybe<DateTimeFilter>;
	failed?: InputMaybe<IntFilter>;
	finishedAt?: InputMaybe<DateTimeNullableFilter>;
	id?: InputMaybe<StringFilter>;
	recordTotal?: InputMaybe<IntFilter>;
	recordType?: InputMaybe<StringFilter>;
	startedAt?: InputMaybe<DateTimeNullableFilter>;
	status?: InputMaybe<EnumJobStatusFilter>;
	success?: InputMaybe<IntFilter>;
	updatedAt?: InputMaybe<DateTimeFilter>;
};

export type RecordImportJobWhereUniqueInput = {
	id?: InputMaybe<Scalars['String']['input']>;
};

export enum RecurrenceFrequency {
	Daily = 'DAILY',
	Monthly = 'MONTHLY',
	Weekly = 'WEEKLY',
	Yearly = 'YEARLY'
}

export type ReportPeriodRangeAmountModel = {
	amount: Scalars['Int']['output'];
	balance: Scalars['Int']['output'];
	credits: Scalars['Int']['output'];
	debits: Scalars['Int']['output'];
	entryCount: Scalars['Int']['output'];
	periodId: Scalars['Int']['output'];
	periodLabel: Scalars['String']['output'];
};

export type RevalAssetChangeInput = {
	amount: Scalars['Int']['input'];
	assetId: Scalars['Int']['input'];
	effectiveDate: Scalars['DateTime']['input'];
	isForecast: Scalars['Boolean']['input'];
};

export type RevalInvestmentChangeInput = {
	amount: Scalars['Int']['input'];
	effectiveDate: Scalars['DateTime']['input'];
	investmentId: Scalars['Int']['input'];
};

export enum Role {
	Admin = 'Admin',
	ReadOnly = 'ReadOnly',
	System = 'System',
	User = 'User'
}

export enum SortOrder {
	Asc = 'asc',
	Desc = 'desc'
}

export type SortOrderInput = {
	nulls?: InputMaybe<NullsOrder>;
	sort: SortOrder;
};

export enum SourceType {
	Auto = 'Auto',
	Import = 'Import',
	Tiller = 'Tiller',
	Ui = 'UI'
}

export type StringFilter = {
	contains?: InputMaybe<Scalars['String']['input']>;
	endsWith?: InputMaybe<Scalars['String']['input']>;
	equals?: InputMaybe<Scalars['String']['input']>;
	gt?: InputMaybe<Scalars['String']['input']>;
	gte?: InputMaybe<Scalars['String']['input']>;
	in?: InputMaybe<Array<Scalars['String']['input']>>;
	lt?: InputMaybe<Scalars['String']['input']>;
	lte?: InputMaybe<Scalars['String']['input']>;
	mode?: InputMaybe<QueryMode>;
	not?: InputMaybe<NestedStringFilter>;
	notIn?: InputMaybe<Array<Scalars['String']['input']>>;
	startsWith?: InputMaybe<Scalars['String']['input']>;
};

export type StringNullableFilter = {
	contains?: InputMaybe<Scalars['String']['input']>;
	endsWith?: InputMaybe<Scalars['String']['input']>;
	equals?: InputMaybe<Scalars['String']['input']>;
	gt?: InputMaybe<Scalars['String']['input']>;
	gte?: InputMaybe<Scalars['String']['input']>;
	in?: InputMaybe<Array<Scalars['String']['input']>>;
	lt?: InputMaybe<Scalars['String']['input']>;
	lte?: InputMaybe<Scalars['String']['input']>;
	mode?: InputMaybe<QueryMode>;
	not?: InputMaybe<NestedStringNullableFilter>;
	notIn?: InputMaybe<Array<Scalars['String']['input']>>;
	startsWith?: InputMaybe<Scalars['String']['input']>;
};

export type TillerAccount = {
	_count: TillerAccountCount;
	accountId: Scalars['String']['output'];
	createdAt: Scalars['DateTime']['output'];
	glAccount: GlAccount;
	glAccountNumber: Scalars['Int']['output'];
	group: Scalars['String']['output'];
	id: Scalars['Int']['output'];
	institution: Scalars['String']['output'];
	name: Scalars['String']['output'];
	tillerTrans?: Maybe<Array<TillerTran>>;
	updatedAt: Scalars['DateTime']['output'];
};

export type TillerAccountCount = {
	tillerTrans: Scalars['Int']['output'];
};

export type TillerAccountNullableScalarRelationFilter = {
	is?: InputMaybe<TillerAccountWhereInput>;
	isNot?: InputMaybe<TillerAccountWhereInput>;
};

export type TillerAccountOrderByWithRelationInput = {
	accountId?: InputMaybe<SortOrder>;
	createdAt?: InputMaybe<SortOrder>;
	glAccount?: InputMaybe<GlAccountOrderByWithRelationInput>;
	glAccountNumber?: InputMaybe<SortOrder>;
	group?: InputMaybe<SortOrder>;
	id?: InputMaybe<SortOrder>;
	institution?: InputMaybe<SortOrder>;
	name?: InputMaybe<SortOrder>;
	updatedAt?: InputMaybe<SortOrder>;
};

export type TillerAccountScalarRelationFilter = {
	is?: InputMaybe<TillerAccountWhereInput>;
	isNot?: InputMaybe<TillerAccountWhereInput>;
};

export type TillerAccountWhereInput = {
	AND?: InputMaybe<Array<TillerAccountWhereInput>>;
	NOT?: InputMaybe<Array<TillerAccountWhereInput>>;
	OR?: InputMaybe<Array<TillerAccountWhereInput>>;
	accountId?: InputMaybe<StringFilter>;
	createdAt?: InputMaybe<DateTimeFilter>;
	glAccountNumber?: InputMaybe<IntFilter>;
	group?: InputMaybe<StringFilter>;
	id?: InputMaybe<IntFilter>;
	institution?: InputMaybe<StringFilter>;
	name?: InputMaybe<StringFilter>;
	updatedAt?: InputMaybe<DateTimeFilter>;
};

export type TillerAccountWhereUniqueInput = {
	accountId?: InputMaybe<Scalars['String']['input']>;
	glAccountNumber?: InputMaybe<Scalars['Int']['input']>;
	id?: InputMaybe<Scalars['Int']['input']>;
	name?: InputMaybe<Scalars['String']['input']>;
};

export type TillerCategory = {
	_count: TillerCategoryCount;
	createdAt: Scalars['DateTime']['output'];
	glAccount?: Maybe<GlAccount>;
	glAccountNumber?: Maybe<Scalars['Int']['output']>;
	group: Scalars['String']['output'];
	id: Scalars['Int']['output'];
	name: Scalars['String']['output'];
	tillerTrans?: Maybe<Array<TillerTran>>;
	type: TillerCategoryType;
	updatedAt: Scalars['DateTime']['output'];
};

export type TillerCategoryCount = {
	tillerTrans: Scalars['Int']['output'];
};

export type TillerCategoryOrderByWithRelationInput = {
	createdAt?: InputMaybe<SortOrder>;
	glAccount?: InputMaybe<GlAccountOrderByWithRelationInput>;
	glAccountNumber?: InputMaybe<SortOrderInput>;
	group?: InputMaybe<SortOrder>;
	id?: InputMaybe<SortOrder>;
	name?: InputMaybe<SortOrder>;
	type?: InputMaybe<SortOrder>;
	updatedAt?: InputMaybe<SortOrder>;
};

export type TillerCategoryScalarRelationFilter = {
	is?: InputMaybe<TillerCategoryWhereInput>;
	isNot?: InputMaybe<TillerCategoryWhereInput>;
};

export enum TillerCategoryType {
	Expense = 'Expense',
	Income = 'Income',
	Transfer = 'Transfer'
}

export type TillerCategoryWhereInput = {
	AND?: InputMaybe<Array<TillerCategoryWhereInput>>;
	NOT?: InputMaybe<Array<TillerCategoryWhereInput>>;
	OR?: InputMaybe<Array<TillerCategoryWhereInput>>;
	createdAt?: InputMaybe<DateTimeFilter>;
	glAccountNumber?: InputMaybe<IntNullableFilter>;
	group?: InputMaybe<StringFilter>;
	id?: InputMaybe<IntFilter>;
	name?: InputMaybe<StringFilter>;
	type?: InputMaybe<EnumTillerCategoryTypeFilter>;
	updatedAt?: InputMaybe<DateTimeFilter>;
};

export type TillerCategoryWhereUniqueInput = {
	id?: InputMaybe<Scalars['Int']['input']>;
	name?: InputMaybe<Scalars['String']['input']>;
};

export type TillerTran = {
	account: Scalars['String']['output'];
	amount: Scalars['Int']['output'];
	category: Scalars['String']['output'];
	createdAt: Scalars['DateTime']['output'];
	date: Scalars['DateTime']['output'];
	dateAdded: Scalars['DateTime']['output'];
	description: Scalars['String']['output'];
	excluded: Scalars['Boolean']['output'];
	generatedJournal?: Maybe<Journal>;
	id: Scalars['Int']['output'];
	reconciled: Scalars['Boolean']['output'];
	tillerAccount: TillerAccount;
	tillerCategory: TillerCategory;
	transactionId: Scalars['String']['output'];
	updatedAt: Scalars['DateTime']['output'];
};

export type TillerTranNullableScalarRelationFilter = {
	is?: InputMaybe<TillerTranWhereInput>;
	isNot?: InputMaybe<TillerTranWhereInput>;
};

export type TillerTranOrderByWithRelationInput = {
	account?: InputMaybe<SortOrder>;
	amount?: InputMaybe<SortOrder>;
	category?: InputMaybe<SortOrder>;
	createdAt?: InputMaybe<SortOrder>;
	date?: InputMaybe<SortOrder>;
	dateAdded?: InputMaybe<SortOrder>;
	description?: InputMaybe<SortOrder>;
	excluded?: InputMaybe<SortOrder>;
	id?: InputMaybe<SortOrder>;
	reconciled?: InputMaybe<SortOrder>;
	tillerAccount?: InputMaybe<TillerAccountOrderByWithRelationInput>;
	tillerCategory?: InputMaybe<TillerCategoryOrderByWithRelationInput>;
	transactionId?: InputMaybe<SortOrder>;
	updatedAt?: InputMaybe<SortOrder>;
};

export type TillerTranWhereInput = {
	AND?: InputMaybe<Array<TillerTranWhereInput>>;
	NOT?: InputMaybe<Array<TillerTranWhereInput>>;
	OR?: InputMaybe<Array<TillerTranWhereInput>>;
	account?: InputMaybe<StringFilter>;
	amount?: InputMaybe<IntFilter>;
	category?: InputMaybe<StringFilter>;
	createdAt?: InputMaybe<DateTimeFilter>;
	date?: InputMaybe<DateTimeFilter>;
	dateAdded?: InputMaybe<DateTimeFilter>;
	description?: InputMaybe<StringFilter>;
	excluded?: InputMaybe<BoolFilter>;
	generatedJournal?: InputMaybe<JournalNullableScalarRelationFilter>;
	id?: InputMaybe<IntFilter>;
	reconciled?: InputMaybe<BoolFilter>;
	tillerAccount?: InputMaybe<TillerAccountScalarRelationFilter>;
	tillerCategory?: InputMaybe<TillerCategoryScalarRelationFilter>;
	transactionId?: InputMaybe<StringFilter>;
	updatedAt?: InputMaybe<DateTimeFilter>;
};

export type TillerTranWhereUniqueInput = {
	id?: InputMaybe<Scalars['Int']['input']>;
	transactionId?: InputMaybe<Scalars['String']['input']>;
};

export type TranSchedule = {
	_count: TranScheduleCount;
	createdAt: Scalars['DateTime']['output'];
	dayOfMonth?: Maybe<Scalars['Int']['output']>;
	dayOfWeek?: Maybe<Weekday>;
	endDate?: Maybe<Scalars['DateTime']['output']>;
	frequency: RecurrenceFrequency;
	id: Scalars['Int']['output'];
	interval: Scalars['Int']['output'];
	isActive: Scalars['Boolean']['output'];
	name: Scalars['String']['output'];
	scheduleLogs: Array<TranScheduleLog>;
	startDate: Scalars['DateTime']['output'];
	templateJournal: Journal;
	templateJournalId: Scalars['String']['output'];
	updatedAt: Scalars['DateTime']['output'];
};

export type TranScheduleCount = {
	scheduleLogs: Scalars['Int']['output'];
};

export type TranScheduleCreateInput = {
	dayOfMonth?: InputMaybe<Scalars['Int']['input']>;
	dayOfWeek?: InputMaybe<Weekday>;
	endDate?: InputMaybe<Scalars['DateTime']['input']>;
	frequency: RecurrenceFrequency;
	interval?: InputMaybe<Scalars['Int']['input']>;
	isActive?: InputMaybe<Scalars['Boolean']['input']>;
	name: Scalars['String']['input'];
	startDate: Scalars['DateTime']['input'];
};

export type TranScheduleLog = {
	createdAt: Scalars['DateTime']['output'];
	errorMessage?: Maybe<Scalars['String']['output']>;
	generatedJournal?: Maybe<Journal>;
	id: Scalars['Int']['output'];
	scheduleDate: Scalars['DateTime']['output'];
	scheduleIndex: Scalars['Int']['output'];
	status: GenerationStatus;
	template: TranSchedule;
	templateId: Scalars['Int']['output'];
	updatedAt: Scalars['DateTime']['output'];
};

export type TranScheduleLogListRelationFilter = {
	every?: InputMaybe<TranScheduleLogWhereInput>;
	none?: InputMaybe<TranScheduleLogWhereInput>;
	some?: InputMaybe<TranScheduleLogWhereInput>;
};

export type TranScheduleLogOrderByRelationAggregateInput = {
	_count?: InputMaybe<SortOrder>;
};

export type TranScheduleLogOrderByWithRelationInput = {
	createdAt?: InputMaybe<SortOrder>;
	errorMessage?: InputMaybe<SortOrderInput>;
	generatedJournal?: InputMaybe<JournalOrderByWithRelationInput>;
	id?: InputMaybe<SortOrder>;
	scheduleDate?: InputMaybe<SortOrder>;
	scheduleIndex?: InputMaybe<SortOrder>;
	status?: InputMaybe<SortOrder>;
	template?: InputMaybe<TranScheduleOrderByWithRelationInput>;
	templateId?: InputMaybe<SortOrder>;
	updatedAt?: InputMaybe<SortOrder>;
};

export type TranScheduleLogResultModel = {
	errorMessage?: Maybe<Scalars['String']['output']>;
	id: Scalars['Int']['output'];
	scheduleDate: Scalars['DateTime']['output'];
	scheduleIndex: Scalars['Int']['output'];
	status: GenerationStatus;
	templateId: Scalars['Int']['output'];
};

export type TranScheduleLogTemplateIdScheduleIndexCompoundUniqueInput = {
	scheduleIndex: Scalars['Int']['input'];
	templateId: Scalars['Int']['input'];
};

export type TranScheduleLogUpdateManyMutationInput = {
	errorMessage?: InputMaybe<Scalars['String']['input']>;
	status?: InputMaybe<GenerationStatus>;
};

export type TranScheduleLogWhereInput = {
	AND?: InputMaybe<Array<TranScheduleLogWhereInput>>;
	NOT?: InputMaybe<Array<TranScheduleLogWhereInput>>;
	OR?: InputMaybe<Array<TranScheduleLogWhereInput>>;
	createdAt?: InputMaybe<DateTimeFilter>;
	errorMessage?: InputMaybe<StringNullableFilter>;
	generatedJournal?: InputMaybe<JournalNullableScalarRelationFilter>;
	id?: InputMaybe<IntFilter>;
	scheduleDate?: InputMaybe<DateTimeFilter>;
	scheduleIndex?: InputMaybe<IntFilter>;
	status?: InputMaybe<EnumGenerationStatusFilter>;
	template?: InputMaybe<TranScheduleScalarRelationFilter>;
	templateId?: InputMaybe<IntFilter>;
	updatedAt?: InputMaybe<DateTimeFilter>;
};

export type TranScheduleLogWhereUniqueInput = {
	id?: InputMaybe<Scalars['Int']['input']>;
	templateId_scheduleIndex?: InputMaybe<TranScheduleLogTemplateIdScheduleIndexCompoundUniqueInput>;
};

export type TranScheduleOrderByWithRelationInput = {
	createdAt?: InputMaybe<SortOrder>;
	dayOfMonth?: InputMaybe<SortOrderInput>;
	dayOfWeek?: InputMaybe<SortOrderInput>;
	endDate?: InputMaybe<SortOrderInput>;
	frequency?: InputMaybe<SortOrder>;
	id?: InputMaybe<SortOrder>;
	interval?: InputMaybe<SortOrder>;
	isActive?: InputMaybe<SortOrder>;
	name?: InputMaybe<SortOrder>;
	scheduleLogs?: InputMaybe<TranScheduleLogOrderByRelationAggregateInput>;
	startDate?: InputMaybe<SortOrder>;
	templateJournal?: InputMaybe<JournalOrderByWithRelationInput>;
	templateJournalId?: InputMaybe<SortOrder>;
	updatedAt?: InputMaybe<SortOrder>;
};

export type TranScheduleResultModel = {
	_count: TranScheduleCount;
	id: Scalars['Int']['output'];
	name: Scalars['String']['output'];
};

export type TranScheduleScalarRelationFilter = {
	is?: InputMaybe<TranScheduleWhereInput>;
	isNot?: InputMaybe<TranScheduleWhereInput>;
};

export type TranScheduleUpdateInput = {
	endDate?: InputMaybe<Scalars['DateTime']['input']>;
	isActive?: InputMaybe<Scalars['Boolean']['input']>;
	name?: InputMaybe<Scalars['String']['input']>;
	regenForecast?: InputMaybe<Scalars['Boolean']['input']>;
};

export type TranScheduleWhereInput = {
	AND?: InputMaybe<Array<TranScheduleWhereInput>>;
	NOT?: InputMaybe<Array<TranScheduleWhereInput>>;
	OR?: InputMaybe<Array<TranScheduleWhereInput>>;
	createdAt?: InputMaybe<DateTimeFilter>;
	dayOfMonth?: InputMaybe<IntNullableFilter>;
	dayOfWeek?: InputMaybe<EnumWeekdayNullableFilter>;
	endDate?: InputMaybe<DateTimeNullableFilter>;
	frequency?: InputMaybe<EnumRecurrenceFrequencyFilter>;
	id?: InputMaybe<IntFilter>;
	interval?: InputMaybe<IntFilter>;
	isActive?: InputMaybe<BoolFilter>;
	name?: InputMaybe<StringFilter>;
	scheduleLogs?: InputMaybe<TranScheduleLogListRelationFilter>;
	startDate?: InputMaybe<DateTimeFilter>;
	templateJournal?: InputMaybe<JournalScalarRelationFilter>;
	templateJournalId?: InputMaybe<StringFilter>;
	updatedAt?: InputMaybe<DateTimeFilter>;
};

export type TranScheduleWhereUniqueInput = {
	id?: InputMaybe<Scalars['Int']['input']>;
	name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateBookInput = {
	name: Scalars['String']['input'];
};

export type UpdateEntityInput = {
	defaultAccountNumber?: InputMaybe<Scalars['Int']['input']>;
	description?: InputMaybe<Scalars['String']['input']>;
	entityType?: InputMaybe<EntityType>;
	name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateJournalEntryInput = {
	amount: Scalars['Int']['input'];
	entityId?: InputMaybe<Scalars['Int']['input']>;
	entrySource?: InputMaybe<SourceType>;
	glAccountNumber: Scalars['Int']['input'];
	id?: InputMaybe<Scalars['Int']['input']>;
	isDebit: Scalars['Boolean']['input'];
	memo: Scalars['String']['input'];
};

export type UserModel = {
	createdAt: Scalars['DateTime']['output'];
	email: Scalars['String']['output'];
	id: Scalars['Int']['output'];
	name: Scalars['String']['output'];
	passwordHash: Scalars['String']['output'];
	updatedAt: Scalars['DateTime']['output'];
	userRole: Role;
};

export type UserOrderByWithRelationInput = {
	createdAt?: InputMaybe<SortOrder>;
	email?: InputMaybe<SortOrder>;
	id?: InputMaybe<SortOrder>;
	name?: InputMaybe<SortOrder>;
	passwordHash?: InputMaybe<SortOrder>;
	updatedAt?: InputMaybe<SortOrder>;
	userRole?: InputMaybe<SortOrder>;
};

export type UserWhereInput = {
	AND?: InputMaybe<Array<UserWhereInput>>;
	NOT?: InputMaybe<Array<UserWhereInput>>;
	OR?: InputMaybe<Array<UserWhereInput>>;
	createdAt?: InputMaybe<DateTimeFilter>;
	email?: InputMaybe<StringFilter>;
	id?: InputMaybe<IntFilter>;
	name?: InputMaybe<StringFilter>;
	passwordHash?: InputMaybe<StringFilter>;
	updatedAt?: InputMaybe<DateTimeFilter>;
	userRole?: InputMaybe<EnumRoleFilter>;
};

export type UserWhereUniqueInput = {
	AND?: InputMaybe<Array<UserWhereInput>>;
	NOT?: InputMaybe<Array<UserWhereInput>>;
	OR?: InputMaybe<Array<UserWhereInput>>;
	createdAt?: InputMaybe<DateTimeFilter>;
	email?: InputMaybe<Scalars['String']['input']>;
	id?: InputMaybe<Scalars['Int']['input']>;
	name?: InputMaybe<StringFilter>;
	passwordHash?: InputMaybe<StringFilter>;
	updatedAt?: InputMaybe<DateTimeFilter>;
	userRole?: InputMaybe<EnumRoleFilter>;
};

export enum Weekday {
	Friday = 'FRIDAY',
	Monday = 'MONDAY',
	Saturday = 'SATURDAY',
	Sunday = 'SUNDAY',
	Thursday = 'THURSDAY',
	Tuesday = 'TUESDAY',
	Wednesday = 'WEDNESDAY'
}

export type BookInfoFragment = { id: number; name: string; system: boolean };

export type BookDataFragment = { id: number; name: string; system: boolean; createdAt: string; updatedAt: string; _count: { journals: number } };

export type PeriodInfoFragment = { id: number; label: string; month: number; year: number; locked: boolean; endDate: string; startDate: string };

export type PeriodRecordFragment = (
  { quarter: number; _count: { journals: number } }
  & PeriodInfoFragment
);

export type GlAccTypeInfoFragment = { id: string; name: string; sortOrder: number; class: AccountTypeClass };

export type GlAccInfoFragment = { id: string; accountNumber: number; name: string; accountTypeName: string; system: boolean; accountType: GlAccTypeInfoFragment };

export type ReportEntryDataFragment = { id: number; amount: number; glAccountNumber: number; isDebit: boolean };

export type ReportJournalDataFragment = { id: string; tranDate: string; tranNumber: number; bookId?: number | null; entries?: Array<ReportEntryDataFragment> | null };

export type TillerCatRecordFragment = { id: number; createdAt: string; updatedAt: string; name: string; type: TillerCategoryType; group: string; glAccountNumber?: number | null; _count: { tillerTrans: number }; glAccount?: GlAccInfoFragment | null };

export type TillerAccountRecordFragment = { id: number; createdAt: string; updatedAt: string; name: string; accountId: string; glAccountNumber: number; group: string; institution: string; _count: { tillerTrans: number }; glAccount: GlAccInfoFragment };

export type TillerTranBaseFragment = { id: number; createdAt: string; updatedAt: string; date: string; dateAdded: string; description: string; reconciled: boolean; transactionId: string; excluded: boolean; category: string; amount: number; account: string; generatedJournal?: { id: string; tranNumber: number } | null };

export type CreateBookMutationVariables = Exact<{
	data: CreateBookInput;
}>;

export type CreateBookMutation = { createBook: BookInfoFragment };

export type RemoveBookMutationVariables = Exact<{
	id: Scalars['Int']['input'];
}>;

export type RemoveBookMutation = { removeBook: BookDataFragment };

export type UpdateBookMutationVariables = Exact<{
	data: UpdateBookInput;
	id: Scalars['Int']['input'];
}>;

export type UpdateBookMutation = { updateBook: BookDataFragment };

export type ListBookInfoQueryVariables = Exact<{ [key: string]: never }>;

export type ListBookInfoQuery = { books: Array<BookInfoFragment> };

export type GetBookDataQueryVariables = Exact<{
	id: Scalars['Int']['input'];
}>;

export type GetBookDataQuery = { book: BookDataFragment };

export type ListBookDataQueryVariables = Exact<{
	orderBy?: InputMaybe<Array<BookOrderByWithRelationInput> | BookOrderByWithRelationInput>;
	where?: InputMaybe<BookWhereInput>;
}>;

export type ListBookDataQuery = { books: Array<BookDataFragment> };

export type SearchPeriodRecordsQueryVariables = Exact<{
	where?: InputMaybe<PeriodWhereInput>;
}>;

export type SearchPeriodRecordsQuery = { periods: Array<PeriodRecordFragment> };

export type ListGlAccTypeInfoQueryVariables = Exact<{
	where?: InputMaybe<GlAccountTypeWhereInput>;
	orderBy?: InputMaybe<Array<GlAccountTypeOrderByWithRelationInput> | GlAccountTypeOrderByWithRelationInput>;
}>;

export type ListGlAccTypeInfoQuery = { glAccountTypes: Array<GlAccTypeInfoFragment> };

export type ListGlAccInfoQueryVariables = Exact<{
	where?: InputMaybe<GlAccountWhereInput>;
	orderBy?: InputMaybe<Array<GlAccountOrderByWithRelationInput> | GlAccountOrderByWithRelationInput>;
}>;

export type ListGlAccInfoQuery = { glAccounts: Array<GlAccInfoFragment> };

export type SearchReportJournalsQueryVariables = Exact<{
	where?: InputMaybe<JournalWhereInput>;
	orderBy?: InputMaybe<Array<JournalOrderByWithRelationInput> | JournalOrderByWithRelationInput>;
}>;

export type SearchReportJournalsQuery = { journals: Array<ReportJournalDataFragment> };

export type GetSetupValsQueryVariables = Exact<{ [key: string]: never }>;

export type GetSetupValsQuery = { users: Array<{ id: number; email: string; name: string }>; books: Array<{ id: number; name: string; system: boolean }> };

export type SearchTillerCatRecordsQueryVariables = Exact<{
	where?: InputMaybe<TillerCategoryWhereInput>;
	orderBy?: InputMaybe<Array<TillerCategoryOrderByWithRelationInput> | TillerCategoryOrderByWithRelationInput>;
}>;

export type SearchTillerCatRecordsQuery = { tillerCategories: Array<TillerCatRecordFragment> };

export type SearchTillerAccRecordsQueryVariables = Exact<{
	where?: InputMaybe<TillerAccountWhereInput>;
	orderBy?: InputMaybe<Array<TillerAccountOrderByWithRelationInput> | TillerAccountOrderByWithRelationInput>;
}>;

export type SearchTillerAccRecordsQuery = { tillerAccounts: Array<TillerAccountRecordFragment> };

export type SearchBaseTillerTransQueryVariables = Exact<{
	where?: InputMaybe<TillerTranWhereInput>;
	orderBy?: InputMaybe<Array<TillerTranOrderByWithRelationInput> | TillerTranOrderByWithRelationInput>;
}>;

export type SearchBaseTillerTransQuery = { tillerTrans: Array<TillerTranBaseFragment> };

export const BookInfoFragmentDoc = gql`
    fragment BookInfo on Book {
  id
  name
  system
}
    `;
export const BookDataFragmentDoc = gql`
    fragment BookData on Book {
  id
  name
  system
  createdAt
  updatedAt
  _count {
    journals
  }
}
    `;
export const PeriodInfoFragmentDoc = gql`
    fragment PeriodInfo on Period {
  id
  label
  month
  year
  locked
  endDate
  startDate
}
    `;
export const PeriodRecordFragmentDoc = gql`
    fragment PeriodRecord on Period {
  ...PeriodInfo
  quarter
  _count {
    journals
  }
}
    `;
export const ReportEntryDataFragmentDoc = gql`
    fragment ReportEntryData on JournalEntry {
  id
  amount
  glAccountNumber
  isDebit
}
    `;
export const ReportJournalDataFragmentDoc = gql`
    fragment ReportJournalData on Journal {
  id
  tranDate
  tranNumber
  bookId
  entries {
    ...ReportEntryData
  }
}
    `;
export const GlAccTypeInfoFragmentDoc = gql`
    fragment GlAccTypeInfo on GlAccountType {
  id
  name
  sortOrder
  class
}
    `;
export const GlAccInfoFragmentDoc = gql`
    fragment GlAccInfo on GlAccount {
  id
  accountNumber
  name
  accountTypeName
  system
  accountType {
    ...GlAccTypeInfo
  }
}
    `;
export const TillerCatRecordFragmentDoc = gql`
    fragment TillerCatRecord on TillerCategory {
  id
  createdAt
  updatedAt
  name
  type
  group
  glAccountNumber
  _count {
    tillerTrans
  }
  glAccount {
    ...GlAccInfo
  }
}
    `;
export const TillerAccountRecordFragmentDoc = gql`
    fragment TillerAccountRecord on TillerAccount {
  id
  createdAt
  updatedAt
  name
  accountId
  glAccountNumber
  group
  institution
  _count {
    tillerTrans
  }
  glAccount {
    ...GlAccInfo
  }
}
    `;
export const TillerTranBaseFragmentDoc = gql`
    fragment TillerTranBase on TillerTran {
  id
  createdAt
  updatedAt
  date
  dateAdded
  description
  reconciled
  transactionId
  excluded
  category
  amount
  account
  generatedJournal {
    id
    tranNumber
  }
}
    `;
export const CreateBookDocument = gql`
    mutation CreateBook($data: CreateBookInput!) {
  createBook(data: $data) {
    ...BookInfo
  }
}
    ${BookInfoFragmentDoc}`;
export const RemoveBookDocument = gql`
    mutation RemoveBook($id: Int!) {
  removeBook(id: $id) {
    ...BookData
  }
}
    ${BookDataFragmentDoc}`;
export const UpdateBookDocument = gql`
    mutation UpdateBook($data: UpdateBookInput!, $id: Int!) {
  updateBook(data: $data, where: {id: $id}) {
    ...BookData
  }
}
    ${BookDataFragmentDoc}`;
export const ListBookInfoDocument = gql`
    query ListBookInfo {
  books {
    ...BookInfo
  }
}
    ${BookInfoFragmentDoc}`;
export const GetBookDataDocument = gql`
    query GetBookData($id: Int!) {
  book(where: {id: $id}) {
    ...BookData
  }
}
    ${BookDataFragmentDoc}`;
export const ListBookDataDocument = gql`
    query ListBookData($orderBy: [BookOrderByWithRelationInput!], $where: BookWhereInput) {
  books(orderBy: $orderBy, where: $where) {
    ...BookData
  }
}
    ${BookDataFragmentDoc}`;
export const SearchPeriodRecordsDocument = gql`
    query SearchPeriodRecords($where: PeriodWhereInput) {
  periods(orderBy: [{year: asc}, {month: asc}], where: $where) {
    ...PeriodRecord
  }
}
    ${PeriodRecordFragmentDoc}
${PeriodInfoFragmentDoc}`;
export const ListGlAccTypeInfoDocument = gql`
    query ListGlAccTypeInfo($where: GlAccountTypeWhereInput, $orderBy: [GlAccountTypeOrderByWithRelationInput!]) {
  glAccountTypes(where: $where, orderBy: $orderBy) {
    ...GlAccTypeInfo
  }
}
    ${GlAccTypeInfoFragmentDoc}`;
export const ListGlAccInfoDocument = gql`
    query ListGlAccInfo($where: GlAccountWhereInput, $orderBy: [GlAccountOrderByWithRelationInput!]) {
  glAccounts(where: $where, orderBy: $orderBy) {
    ...GlAccInfo
  }
}
    ${GlAccInfoFragmentDoc}
${GlAccTypeInfoFragmentDoc}`;
export const SearchReportJournalsDocument = gql`
    query SearchReportJournals($where: JournalWhereInput, $orderBy: [JournalOrderByWithRelationInput!]) {
  journals(where: $where, orderBy: $orderBy) {
    ...ReportJournalData
  }
}
    ${ReportJournalDataFragmentDoc}
${ReportEntryDataFragmentDoc}`;
export const GetSetupValsDocument = gql`
    query GetSetupVals {
  users {
    id
    email
    name
  }
  books {
    id
    name
    system
  }
}
    `;
export const SearchTillerCatRecordsDocument = gql`
    query SearchTillerCatRecords($where: TillerCategoryWhereInput, $orderBy: [TillerCategoryOrderByWithRelationInput!]) {
  tillerCategories(where: $where, orderBy: $orderBy) {
    ...TillerCatRecord
  }
}
    ${TillerCatRecordFragmentDoc}
${GlAccInfoFragmentDoc}
${GlAccTypeInfoFragmentDoc}`;
export const SearchTillerAccRecordsDocument = gql`
    query SearchTillerAccRecords($where: TillerAccountWhereInput, $orderBy: [TillerAccountOrderByWithRelationInput!]) {
  tillerAccounts(where: $where, orderBy: $orderBy) {
    ...TillerAccountRecord
  }
}
    ${TillerAccountRecordFragmentDoc}
${GlAccInfoFragmentDoc}
${GlAccTypeInfoFragmentDoc}`;
export const SearchBaseTillerTransDocument = gql`
    query SearchBaseTillerTrans($where: TillerTranWhereInput, $orderBy: [TillerTranOrderByWithRelationInput!]) {
  tillerTrans(where: $where, orderBy: $orderBy) {
    ...TillerTranBase
  }
}
    ${TillerTranBaseFragmentDoc}`;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?: Record<string, string>) => Promise<T>, operationName: string, operationType?: string, variables?: any) => Promise<T>;

const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType, _variables) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
	return {
		CreateBook(variables: CreateBookMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CreateBookMutation> {
			return withWrapper((wrappedRequestHeaders) => client.request<CreateBookMutation>({ document: CreateBookDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'CreateBook', 'mutation', variables);
		},
		RemoveBook(variables: RemoveBookMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<RemoveBookMutation> {
			return withWrapper((wrappedRequestHeaders) => client.request<RemoveBookMutation>({ document: RemoveBookDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'RemoveBook', 'mutation', variables);
		},
		UpdateBook(variables: UpdateBookMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<UpdateBookMutation> {
			return withWrapper((wrappedRequestHeaders) => client.request<UpdateBookMutation>({ document: UpdateBookDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'UpdateBook', 'mutation', variables);
		},
		ListBookInfo(variables?: ListBookInfoQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<ListBookInfoQuery> {
			return withWrapper((wrappedRequestHeaders) => client.request<ListBookInfoQuery>({ document: ListBookInfoDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'ListBookInfo', 'query', variables);
		},
		GetBookData(variables: GetBookDataQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetBookDataQuery> {
			return withWrapper((wrappedRequestHeaders) => client.request<GetBookDataQuery>({ document: GetBookDataDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetBookData', 'query', variables);
		},
		ListBookData(variables?: ListBookDataQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<ListBookDataQuery> {
			return withWrapper((wrappedRequestHeaders) => client.request<ListBookDataQuery>({ document: ListBookDataDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'ListBookData', 'query', variables);
		},
		SearchPeriodRecords(variables?: SearchPeriodRecordsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<SearchPeriodRecordsQuery> {
			return withWrapper((wrappedRequestHeaders) => client.request<SearchPeriodRecordsQuery>({ document: SearchPeriodRecordsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'SearchPeriodRecords', 'query', variables);
		},
		ListGlAccTypeInfo(variables?: ListGlAccTypeInfoQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<ListGlAccTypeInfoQuery> {
			return withWrapper((wrappedRequestHeaders) => client.request<ListGlAccTypeInfoQuery>({ document: ListGlAccTypeInfoDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'ListGlAccTypeInfo', 'query', variables);
		},
		ListGlAccInfo(variables?: ListGlAccInfoQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<ListGlAccInfoQuery> {
			return withWrapper((wrappedRequestHeaders) => client.request<ListGlAccInfoQuery>({ document: ListGlAccInfoDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'ListGlAccInfo', 'query', variables);
		},
		SearchReportJournals(variables?: SearchReportJournalsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<SearchReportJournalsQuery> {
			return withWrapper((wrappedRequestHeaders) => client.request<SearchReportJournalsQuery>({ document: SearchReportJournalsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'SearchReportJournals', 'query', variables);
		},
		GetSetupVals(variables?: GetSetupValsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetSetupValsQuery> {
			return withWrapper((wrappedRequestHeaders) => client.request<GetSetupValsQuery>({ document: GetSetupValsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetSetupVals', 'query', variables);
		},
		SearchTillerCatRecords(variables?: SearchTillerCatRecordsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<SearchTillerCatRecordsQuery> {
			return withWrapper((wrappedRequestHeaders) => client.request<SearchTillerCatRecordsQuery>({ document: SearchTillerCatRecordsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'SearchTillerCatRecords', 'query', variables);
		},
		SearchTillerAccRecords(variables?: SearchTillerAccRecordsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<SearchTillerAccRecordsQuery> {
			return withWrapper((wrappedRequestHeaders) => client.request<SearchTillerAccRecordsQuery>({ document: SearchTillerAccRecordsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'SearchTillerAccRecords', 'query', variables);
		},
		SearchBaseTillerTrans(variables?: SearchBaseTillerTransQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<SearchBaseTillerTransQuery> {
			return withWrapper((wrappedRequestHeaders) => client.request<SearchBaseTillerTransQuery>({ document: SearchBaseTillerTransDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'SearchBaseTillerTrans', 'query', variables);
		}
	};
}
export type Sdk = ReturnType<typeof getSdk>;
