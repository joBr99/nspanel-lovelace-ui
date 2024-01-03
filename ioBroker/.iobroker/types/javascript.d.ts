// import all modules that are available in the sandbox
// this has a nice side effect that we may augment the global scope
import * as child_process from "child_process";
import * as os from "os";

type EmptyCallback = () => void | Promise<void>;
type ErrorCallback = (err?: string) => void | Promise<void>;
type GenericCallback<T> = (err?: string | null, result?: T) => void | Promise<void>;
type SimpleCallback<T> = (result?: T) => void | Promise<void>;
type LogCallback = (msg: any) => void | Promise<void>;

type SecondParameterOf<T extends (...args: any[]) => any> = T extends (
	arg0: any,
	arg1: infer R,
	...args: any[]
) => any
	? R
	: never;
/** Infers the return type from a callback-style API and strips out null and undefined */
type NonNullCallbackReturnTypeOf<T extends (...args: any[]) => any> = Exclude<
	SecondParameterOf<T>,
	null | undefined
>;
/** Infers the return type from a callback-style API and leaves null and undefined in */
type CallbackReturnTypeOf<T extends (...args: any[]) => any> = SecondParameterOf<T>;

/** Returns a type that requires at least one of the properties from the given type */
type AtLeastOne<T, U = { [K in keyof T]-?: T[K] }> = { [K in keyof U]: { [P in K]: U[P] } }[keyof U];

/** Returns all possible keys of a union of objects */
type AllKeys<T> = T extends any ? keyof T : never;
/** Simplifies mapped types to their basic forms */
type Simplify<U> = U extends infer O ? { [K in keyof O]: O[K] } : never;

/** Takes an object type and adds all missing properties from the Keys union with the type `never` */
type AddMissingNever<T, Keys extends string | number | symbol> = {
	[K in Keys]: K extends keyof T ? T[K] : never;
};

/**
 * Takes a union of objects and returns an object type
 * which has all properties that exist on at least one of the objects.
 *
 * E.g. CombineObjectUnion<{a: 1} | {b: 2}> = {a: 1; b: 2};
 */
type CombineObjectUnion<
	T,
	Keys extends string | number | symbol = AllKeys<T>,
	O = T extends any ? AddMissingNever<T, Keys> : never
	> = Simplify<{ [K in Keys]: K extends keyof O ? O[K] : never }>

/**
 * Takes a union of ioBroker Object types and returns a combined object type
 * which has all properties that could exist on at least one of the objects.
 *
 * Note: This is not entirely sound to work with, but better for JS and working with read objects
 */
type AnyOf<
	T,
	Keys extends string | number | symbol = AllKeys<T>,
	O = T extends any ? AddMissingNever<T, Keys> : never
	> = Simplify<{
		[K in Keys]: K extends keyof O ? (
			O[K] extends any[] ? O[K]
			: O[K] extends Record<any, any> ? CombineObjectUnion<O[K]>
			: O[K]
		) : never;
	}>;

// tslint:disable:no-namespace
declare global {

	namespace iobJS {

		enum StateQuality {
			good = 0x00, // or undefined or null
			bad = 0x01,
			general_problem = 0x01,
			general_device_problem = 0x41,
			general_sensor_problem = 0x81,
			device_not_connected = 0x42,
			sensor_not_connected = 0x82,
			device_reports_error = 0x44,
			sensor_reports_error = 0x84,
		}

		type PrimitiveTypeStateValue = string | number | boolean;
		type StateValue = null | PrimitiveTypeStateValue | PrimitiveTypeStateValue[] | Record<string, any>;

		interface State<T extends StateValue = any> {
			/** The value of the state. */
			val: T;

			/** Direction flag: false for desired value and true for actual value. Default: false. */
			ack: boolean;

			/** Unix timestamp. Default: current time */
			ts: number;

			/** Unix timestamp of the last time the value changed */
			lc: number;

			/** Name of the adapter instance which set the value, e.g. "system.adapter.web.0" */
			from: string;

			/** Optional time in seconds after which the state is reset to null */
			expire?: number;

			/** Optional quality of the state value */
			q?: StateQuality;

			/** Optional comment */
			c?: string;

			/** Discriminant property to switch between AbsentState and State<T> */
			notExist: undefined;
		}

		type SettableState = AtLeastOne<State>;

		interface AbsentState {
			val: null;
			notExist: true;

			ack: undefined;
			ts: undefined;
			lc: undefined;
			from: undefined;
			expire: undefined;
			q: undefined;
			c: undefined;
		}

		type Languages = 'en' | 'de' | 'ru' | 'pt' | 'nl' | 'fr' | 'it' | 'es' | 'pl' | 'zh-cn';
		type StringOrTranslated = string | { [lang in Languages]?: string; };
		type CommonType = "number" | "string" | "boolean" | "array" | "object" | "mixed" | "file";

		/** Defines access rights for a single object type */
		interface ObjectOperationPermissions {
			/** Whether a user may enumerate objects of this type */
			list: boolean;
			/** Whether a user may read objects of this type */
			read: boolean;
			/** Whether a user may write objects of this type */
			write: boolean;
			/** Whether a user may create objects of this type */
			create: boolean;
			/** Whether a user may delete objects of this type */
			delete: boolean;
		}

		/** Defines the rights a user or group has to change objects */
		interface ObjectPermissions {
			/** The access rights for files */
			file: ObjectOperationPermissions;
			/** The access rights for objects */
			object: ObjectOperationPermissions;
			/** The access rights for users/groups */
			users: ObjectOperationPermissions;
			/** The access rights for states */
			state?: ObjectOperationPermissions;
		}
		/** Defined the complete set of access rights a user has */
		interface PermissionSet extends ObjectPermissions {
			/** The name of the user this ACL is for */
			user: string;
			/** The name of the groups this ACL was merged from */
			groups: string[];
			/** The access rights for certain commands */
			other: {
				execute: boolean;
				http: boolean;
				sendto: boolean;
			};
		}

		interface ObjectACL {
			/** Full name of the user who owns this object, e.g. "system.user.admin" */
			owner: string;
			/** Full name of the group who owns this object, e.g. "system.group.administrator" */
			ownerGroup: string;
			/** Linux-type permissions defining access to this object */
			object: number;
		}
		/** Defines access rights for a single state object */
		interface StateACL extends ObjectACL {
			/** Linux-type permissions defining access to this state */
			state: number;
		}

		/** Defines the existing object types in ioBroker */
		type ObjectType =
			| 'state'
			| 'channel'
			| 'device'
			| 'folder'
			| 'enum'
			| 'adapter'
			| 'config'
			| 'group'
			| 'host'
			| 'instance'
			| 'meta'
			| 'script'
			| 'user'
			| 'chart';

		// Define the naming schemes for objects, so we can provide more specific types for get/setObject
		namespace ObjectIDs {
			// Guaranteed meta objects
			type Meta =
				| `${string}.${number}`
				| `${string}.${"meta" | "admin"}`
				| `${string}.meta.${string}`
				| `${string}.${number}.meta.${string}`;

			// Unsure, can be folder, device, channel or state
			// --> We need this match to avoid matching the more specific types below
			type Misc =
				| `system.host.${string}.${string}`
				| `0_userdata.0.${string}`;

			// Guaranteed channel objects
			type Channel =
				| `script.js.${"common" | "global"}`
				| `${string}.${number}.info`;
			// Either script or channel object
			type ScriptOrChannel = `script.js.${string}`;
			// Guaranteed state objects
			type State =
				| `system.adapter.${string}.${number}.${string}`;
			// Guaranteed enum objects
			type Enum = `enum.${string}`;
			// Guaranteed instance objects
			type Instance = `system.adapter.${string}.${number}`;
			// Guaranteed adapter objects
			type Adapter = `system.adapter.${string}`;
			// Guaranteed group objects
			type Group = `system.group.${string}`;
			// Guaranteed user objects
			type User = `system.user.${string}`;
			// Guaranteed host objects
			type Host = `system.host.${string}`;
			// Guaranteed config objects
			type Config = `system.${"certificates" | "config" | "repositories"}`;

			// Unsure, can be folder, device, channel or state (or whatever an adapter does)
			type AdapterScoped =
				| `${string}.${number}.${string}`;

			/** All possible typed object IDs */
			type Any =
				| Meta
				| Misc
				| Channel
				| ScriptOrChannel
				| State
				| Enum
				| Instance
				| Adapter
				| Group
				| User
				| Host
				| Config
				| AdapterScoped;
		}

		type ObjectIdToObjectType<
			T extends string,
			Read extends "read" | "write" = "read",
			O =
				// State must come before Adapter or system.adapter.admin.0.foobar will resolve to AdapterObject
				T extends ObjectIDs.State ? StateObject :
				// Instance and Adapter must come before meta or `system.adapter.admin` will resolve to MetaObject
				T extends ObjectIDs.Instance ? InstanceObject :
				T extends ObjectIDs.Adapter ? AdapterObject :
				T extends ObjectIDs.Channel ? ChannelObject :
				T extends ObjectIDs.Meta ? MetaObject :
				T extends ObjectIDs.Misc ? AdapterScopedObject :
				T extends ObjectIDs.ScriptOrChannel ? (ScriptObject | ChannelObject) :
				T extends ObjectIDs.Enum ? EnumObject :
				T extends ObjectIDs.Group ? GroupObject :
				T extends ObjectIDs.User ? UserObject :
				T extends ObjectIDs.Host ? HostObject :
				T extends ObjectIDs.Config ? OtherObject & { type: "config" } :
				T extends ObjectIDs.AdapterScoped ? AdapterScopedObject :
				iobJS.AnyObject
				// When reading objects, we should be less strict, so working with the return type is less of a pain to work with
			> = Read extends "read" ? AnyOf<O> : O;

		interface ObjectCommon {
			/** The name of this object as a simple string or an object with translations */
			name: StringOrTranslated;

			/** When set to true, this object may not be deleted */
			dontDelete?: true;

			/** When set to true, this object is only visible when expert mode is turned on in admin */
			expert?: true;

			// Icon and role aren't defined in SCHEMA.md,
			// but they are being used by some adapters
			/** Icon for this object */
			icon?: string;
			/** role of the object */
			role?: string;
		}

		interface StateCommonAlias {
			/** The target state id or two target states used for reading and writing values */
			id: string | { read: string; write: string };
			/** An optional conversion function when reading, e.g. `"(val − 32) * 5/9"` */
			read?: string;
			/** An optional conversion function when reading, e.g. `"(val * 9/5) + 32"` */
			write?: string;
		}

		interface StateCommon extends ObjectCommon {
			/** Type of this state. See https://github.com/ioBroker/ioBroker/blob/master/doc/SCHEMA.md#state-commonrole for a detailed description */
			type?: CommonType;
			/** minimum value */
			min?: number;
			/** maximum value */
			max?: number;
			/** the allowed interval for numeric values */
			step?: number;
			/** unit of the value */
			unit?: string;
			/** description of this state */
			desc?: StringOrTranslated;

			/** if this state is readable */
			read: boolean;
			/** if this state is writable */
			write: boolean;
			/** role of the state (used in user interfaces to indicate which widget to choose) */
			role: string;

			/** the default value */
			def?: any;
			/** the default status of the ack flag */
			defAck?: boolean;

			/** Configures this state as an alias for another state */
			alias?: StateCommonAlias;

			/**
			 * Dictionary of possible values for this state in the form
			 * <pre>
			 * {
			 *     "internal value 1": "displayed value 1",
			 *     "internal value 2": "displayed value 2",
			 *     ...
			 * }
			 * </pre>
			 * In old ioBroker versions, this could also be a string of the form
			 * "val1:text1;val2:text2" (now deprecated)
			 */
			states?: Record<string, string> | string;

			/** ID of a helper state indicating if the handler of this state is working */
			workingID?: string;

			/** attached history information */
			history?: any;

			/** Custom settings for this state */
			custom?: Record<string, any>;

			/**
			 * Settings for IOT adapters and how the state should be named in e.g., Alexa.
			 * The string "ignore" is a special case, causing the state to be ignored.
			 */
			smartName?: string | ({ [lang in Languages]?: string; } & {
				/** Which kind of device this is */
				smartType?: string | null;
				/** Which value to set when the ON command is issued */
				byOn?: string | null;
			});
		}
		interface ChannelCommon extends ObjectCommon {
			/** description of this channel */
			desc?: string;

			// Make it possible to narrow the object type using the custom property
			custom?: undefined;
		}
		interface DeviceCommon extends ObjectCommon {
			// TODO: any other definition for device?

			// Make it possible to narrow the object type using the custom property
			custom?: undefined;
		}
		interface EnumCommon extends ObjectCommon {
			/** The IDs of the enum members */
			members?: string[];

			// Make it possible to narrow the object type using the custom property
			custom?: undefined;
		}

		interface MetaCommon extends ObjectCommon {
			// Meta-objects have to additional CommonTypes
			type: CommonType | "meta.user" | "meta.folder";

			// Make it possible to narrow the object type using the custom property
			custom?: undefined;
		}

		type InstanceMode = 'none' | 'daemon' | 'subscribe' | 'schedule' | 'once' | 'extension';
		interface InstanceCommon extends ObjectCommon {
			/** The name of the host where this instance is running */
			host: string;
			enabled: boolean;
			/** How and when this instance should be started */
			mode: InstanceMode;

			// Make it possible to narrow the object type using the custom property
			custom?: undefined;
		}

		interface HostCommon extends ObjectCommon {
			/** The display name of this host */
			name: string;
			title: string;
			installedVersion: string; // e.g. 1.2.3 (following semver)
			/** The command line of the executable */
			cmd: string;
			hostname: string;
			/** An array of IP addresses this host exposes */
			address: string[]; // IPv4 or IPv6

			type: 'js-controller';
			platform: 'Javascript/Node.js';

			// Make it possible to narrow the object type using the custom property
			custom?: undefined;
		}

		interface HostNative {
			process: {
				title: string;
				versions: NodeJS.ProcessVersions;
				env: Record<string, string>;
			};
			os: {
				hostname: string,
				type: ReturnType<typeof os["type"]>;
				platform: ReturnType<typeof os["platform"]>;
				arch: ReturnType<typeof os["arch"]>;
				release: ReturnType<typeof os["release"]>;
				endianness: ReturnType<typeof os["endianness"]>;
				tmpdir: ReturnType<typeof os["tmpdir"]>;
			};
			hardware: {
				cpus: ReturnType<typeof os["cpus"]>;
				totalmem: ReturnType<typeof os["totalmem"]>;
				networkInterfaces: ReturnType<typeof os["networkInterfaces"]>;
			};
		}

		interface UserCommon extends ObjectCommon {
			/** The username */
			name: string;
			/** The hashed password */
			password: string;
			/** Whether this user is enabled */
			enabled: boolean;

			// Make it possible to narrow the object type using the custom property
			custom?: undefined;
		}

		interface GroupCommon extends ObjectCommon {
			/** The name of this group */
			name: string;
			/** The users of this group */
			members: string[]; // system.user.name, ...
			/** The default permissions of this group */
			acl: Omit<PermissionSet, "user" | "groups">;

			// Make it possible to narrow the object type using the custom property
			custom?: undefined;
		}

		interface ScriptCommon extends ObjectCommon {
			name: string;
			/** Defines the type of the script, e.g. TypeScript/ts, JavaScript/js or Blockly */
			engineType: string;
			/** The instance id of the instance which executes this script */
			engine: string;
			/** The source code of this script */
			source: string;
			debug: boolean;
			verbose: boolean;
			/** Whether this script should be executed */
			enabled: boolean;
			/** Is used to determine whether a script has changed and needs to be recompiled */
			sourceHash?: string;
			/** If the script uses a compiled language like TypeScript, this contains the compilation output */
			compiled?: string;
			/** If the script uses a compiled language like TypeScript, this contains the generated declarations (global scripts only) */
			declarations?: string;

			// Make it possible to narrow the object type using the custom property
			custom?: undefined;
		}

		type WelcomeScreenEntry = string | {
			link: string;
			name: string;
			img: string;
			color: string;
		};

		interface AdapterCommon extends ObjectCommon {
			/** Custom attributes to be shown in admin in the object browser */
			adminColumns?: any[];
			/** Settings for custom Admin Tabs */
			adminTab?: {
				name?: string;
				/** Icon name for FontAwesome */
				"fa-icon"?: string;
				/** If true, the Tab is not reloaded when the configuration changes */
				ignoreConfigUpdate?: boolean;
				/** Which URL should be loaded in the tab. Supports placeholders like http://%ip%:%port% */
				link?: string;
				/** If true, only one instance of this tab will be created for all instances */
				singleton?: boolean;
			};
			allowInit?: boolean;
			/** Possible values for the instance mode (if more than one is possible) */
			availableModes?: InstanceMode[];
			/** Whether this adapter includes custom blocks for Blockly. If true, `admin/blockly.js` must exist. */
			blockly?: boolean;
			/** Where the adapter will get its data from. Set this together with @see dataSource */
			connectionType?: "local" | "cloud";
			/** If true, this adapter can be started in compact mode (in the same process as other adpaters) */
			compact?: boolean;
			/** The directory relative to iobroker-data where the adapter stores the data. Supports the placeholder `%INSTANCE%`. This folder will be backed up and restored automatically. */
			dataFolder?: string;
			/** How the adapter will mainly receive its data. Set this together with @see connectionType */
			dataSource?: "poll" | "push" | "assumption";
			/** A record of ioBroker adapters (including "js-controller") and version ranges which are required for this adapter. */
			dependencies?: Array<Record<string, string>>;
			/** Which files outside of the README.md have documentation for the adapter */
			docs?: Partial<Record<Languages, string | string[]>>;
			/** Whether new instances should be enabled by default. *Should* be `false`! */
			enabled: boolean;
			/** If true, all previous data in the target directory (web) should be deleted before uploading */
			eraseOnUpload?: boolean;
			/** URL of an external icon that is shown for adapters that are not installed */
			extIcon?: string;
			/** Whether this adapter responds to `getHistory` messages */
			getHistory?: boolean;
			/** Filename of the local icon which is shown for installed adapters. Should be located in the `admin` directory */
			icon?: string;
			/** Which version of this adapter is installed */
			installedVersion: string;
			keywords?: string[];
			/** A dictionary of links to web services this adapter provides */
			localLinks?: Record<string, string>;
			/** @deprecated Use @see localLinks */
			localLink?: string;
			logLevel?: LogLevel;
			/** Whether this adapter receives logs from other hosts and adapters (e.g., to strore them somewhere) */
			logTransporter?: boolean;
			/** Path to the start file of the adapter. Should be the same as in `package.json` */
			main?: string;
			/** Whether the admin tab is written in materialize style. Required for Admin 3+ */
			materializeTab: boolean;
			/** Whether the admin configuration dialog is written in materialize style. Required for Admin 3+ */
			materialize: boolean;
			/** If `true`, the object `system.adapter.<adaptername>.<adapterinstance>.messagebox will be created to send messages to the adapter (used for email, pushover, etc...) */
			messagebox?: true;
			mode: InstanceMode;
			/** Name of the adapter (without leading `ioBroker.`) */
			name: string;
			/** If `true`, no configuration dialog will be shown */
			noConfig?: true;
			/** If `true`, this adapter's instances will not be shown in the admin overview screen. Useful for icon sets and widgets... */
			noIntro?: true;
			/** Set to `true` if the adapter is not available in the official ioBroker repositories. */
			noRepository?: true;
			/** If `true`, manual installation from GitHub is not possible */
			nogit?: true;
			/** If `true`, this adapter cannot be deleted or updated manually. */
			nondeletable?: true;
			/** If `true`, this "adapter" only contains HTML files and no main executable */
			onlyWWW?: boolean;
			/** Used to configure native (OS) dependencies of this adapter that need to be installed with system package manager before installing the adapter */
			osDependencies?: {
				/** For OSX */
				darwin: string[];
				/** For Linux */
				linux: string[];
				/** For Windows */
				win32: string[];
			};
			/** Which OSes this adapter supports */
			os?: "linux" | "darwin" | "win32" | Array<("linux" | "darwin" | "win32")>;
			platform: "Javascript/Node.js";
			/** The keys of common attributes (e.g. `history`) which are not deleted in a `setObject` call even if they are not present. Deletion must be done explicitly by setting them to `null`. */
			preserveSettings?: string | string[];
			/** Which adapters must be restarted after installing or updating this adapter. */
			restartAdapters?: string[];
			/** If the adapter runs in `schedule` mode, this contains the CRON */
			schedule?: string;
			serviceStates?: boolean | string;
			/** Whether this adapter may only be installed once per host */
			singletonHost?: boolean;
			/** Whether this adapter may only be installed once in the whole system */
			singleton?: boolean;
			/** Whether the adapter must be stopped before an update */
			stopBeforeUpdate?: boolean;
			/** Overrides the default timeout that ioBroker will wait before force-stopping the adapter */
			stopTimeout?: number;
			subscribable?: boolean;
			subscribe?: any; // ?
			/** If `true`, this adapter provides custom per-state settings. Requires a `custom_m.html` file in the `admin` directory. */
			supportCustoms?: boolean;
			/** Whether the adapter supports the signal stopInstance via messagebox */
			supportStopInstance?: boolean;
			/** The translated names of this adapter to be shown in the admin UI */
			titleLang?: Record<Languages, string>;
			/** @deprecated The name of this adapter to be shown in the admin UI. Use @see titleLang instead. */
			title?: string;
			/** The type of this adapter */
			type?: string;
			/** If `true`, the `npm` package must be installed with the `--unsafe-perm` flag */
			unsafePerm?: true;
			/** The available version in the ioBroker repo. */
			version: string;
			/** If `true`, the adapter will be started if any value is written into `system.adapter.<name>.<instance>.wakeup. Normally, the adapter should stop after processing the event. */
			wakeup?: boolean;
			/** Include the adapter version in the URL of the web adapter, e.g. `http://ip:port/1.2.3/material` instead of `http://ip:port/material` */
			webByVersion?: boolean;
			/** Whether the web server in this adapter can be extended with plugin/extensions */
			webExtendable?: boolean;
			/** Relative path to a module that contains an extension for the web adapter. Use together with @see native.webInstance to configure which instances this affects */
			webExtension?: string;
			webPreSettings?: any; // ?
			webservers?: any; // ?
			/** A list of pages that should be shown on the "web" index page */
			welcomeScreen?: WelcomeScreenEntry[];
			/** A list of pages that should be shown on the ioBroker cloud index page */
			welcomeScreenPro?: WelcomeScreenEntry[];
			wwwDontUpload?: boolean;

			// Make it possible to narrow the object type using the custom property
			custom?: undefined;
		}

		interface OtherCommon extends ObjectCommon {
			[propName: string]: any;

			// Make it possible to narrow the object type using the custom property
			custom?: undefined;
		}

		/* Base type for Objects. Should not be used directly */
		interface BaseObject {
			/** The ID of this object */
			_id: string;
			type: ObjectType; // specified in the derived interfaces
			// Ideally we would limit this to JSON-serializable objects, but TypeScript doesn't allow this
			// without bugging users to change their code --> https://github.com/microsoft/TypeScript/issues/15300
			native: Record<string, any>;
			common: Record<string, any>;
			enums?: Record<string, string>;
			acl?: ObjectACL;
			from?: string;
			/** The user who created or updated this object */
			user?: string;
			ts?: number;
		}

		interface StateObject extends BaseObject {
			type: 'state';
			common: StateCommon;
			acl?: StateACL;
		}
		interface PartialStateObject extends Partial<Omit<StateObject, 'common' | 'acl'>> {
			common?: Partial<StateCommon>;
			acl?: Partial<StateACL>;
		}

		interface ChannelObject extends BaseObject {
			type: 'channel';
			common: ChannelCommon;
		}
		interface PartialChannelObject
			extends Partial<Omit<ChannelObject, 'common'>> {
			common?: Partial<ChannelCommon>;
		}

		interface DeviceObject extends BaseObject {
			type: 'device';
			common: DeviceCommon;
		}
		interface PartialDeviceObject extends Partial<Omit<DeviceObject, 'common'>> {
			common?: Partial<DeviceCommon>;
		}

		interface FolderObject extends BaseObject {
			type: 'folder';
			// Nothing is set in stone here, so start with allowing every property
			common: OtherCommon;
		}
		interface PartialFolderObject extends Partial<Omit<FolderObject, 'common'>> {
			common?: Partial<OtherCommon>;
		}

		interface EnumObject extends BaseObject {
			type: 'enum';
			common: EnumCommon;
		}
		interface PartialEnumObject extends Partial<Omit<EnumObject, 'common'>> {
			common?: Partial<EnumCommon>;
		}

		interface MetaObject extends BaseObject {
			type: 'meta';
			common: MetaCommon;
		}
		interface PartialMetaObject extends Partial<Omit<MetaObject, 'common'>> {
			common?: Partial<MetaCommon>;
		}

		interface InstanceObject extends BaseObject {
			type: 'instance';
			common: InstanceCommon;
		}
		interface PartialInstanceObject extends Partial<Omit<InstanceObject, 'common'>> {
			common?: Partial<InstanceCommon>;
		}

		interface AdapterObject extends BaseObject {
			type: 'adapter';
			common: AdapterCommon;
			/** An array of `native` properties which cannot be accessed from outside the defining adapter */
			protectedNative?: string[];
			/** Like protectedNative, but the properties are also encrypted and decrypted automatically */
			encryptedNative?: string[];
		}
		interface PartialAdapterObject extends Partial<Omit<AdapterObject, 'common'>> {
			common?: Partial<AdapterCommon>;
		}

		interface HostObject extends BaseObject {
			type: 'host';
			common: HostCommon;
			native: HostNative;
		}
		interface PartialHostObject extends Partial<Omit<HostObject, 'common' | 'native'>> {
			common?: Partial<HostCommon>;
			native?: Partial<HostNative>;
		}

		interface UserObject extends BaseObject {
			type: 'user';
			common: UserCommon;
		}
		interface PartialUserObject extends Partial<Omit<UserObject, 'common'>> {
			common?: Partial<UserCommon>;
		}

		interface GroupObject extends BaseObject {
			type: 'group';
			common: GroupCommon;
		}
		interface PartialGroupObject extends Partial<Omit<GroupObject, 'common'>> {
			common?: Partial<GroupCommon>;
		}

		interface ScriptObject extends BaseObject {
			type: 'script';
			common: ScriptCommon;
		}
		interface PartialScriptObject extends Partial<Omit<ScriptObject, 'common'>> {
			common?: Partial<ScriptCommon>;
		}

		interface OtherObject extends BaseObject {
			type: 'config' | 'chart';
			common: OtherCommon;
		}
		interface PartialOtherObject extends Partial<Omit<OtherObject, 'common'>> {
			common?: Partial<OtherCommon>;
		}

		type AnyObject =
			| StateObject
			| ChannelObject
			| DeviceObject
			| FolderObject
			| EnumObject
			| MetaObject
			| HostObject
			| AdapterObject
			| InstanceObject
			| UserObject
			| GroupObject
			| ScriptObject
			| OtherObject;

		type AnyPartialObject =
			| PartialStateObject
			| PartialChannelObject
			| PartialDeviceObject
			| PartialFolderObject
			| PartialEnumObject
			| PartialMetaObject
			| PartialHostObject
			| PartialAdapterObject
			| PartialInstanceObject
			| PartialUserObject
			| PartialGroupObject
			| PartialScriptObject
			| PartialOtherObject;

		/** All objects that usually appear in an adapter scope */
		type AdapterScopedObject = FolderObject | DeviceObject | ChannelObject | StateObject;

		// For all objects that are exposed to the user we need to tone the strictness down.
		// Otherwise, every operation on objects becomes a pain to work with
		type Object = AnyObject;

		// In set[Foreign]Object[NotExists] methods, the ID and acl of the object is optional
		type SettableObjectWorker<T> = T extends AnyObject ? Omit<T, '_id' | 'acl'> & {
			_id?: T['_id'];
			acl?: T['acl'];
		} : never;
		// in extend[Foreign]Object, most properties are optional
		type PartialObjectWorker<T> = T extends AnyObject ? AnyPartialObject & { type?: T["type"] } : never;

		type PartialObject<T extends AnyObject = AnyObject> = PartialObjectWorker<T>;

		// Convenient definitions for manually specifying settable object types
		type SettableObject<T extends AnyObject = AnyObject> = SettableObjectWorker<T>;
		type SettableStateObject = SettableObject<StateObject>;
		type SettableChannelObject = SettableObject<ChannelObject>;
		type SettableDeviceObject = SettableObject<DeviceObject>;
		type SettableFolderObject = SettableObject<FolderObject>;
		type SettableEnumObject = SettableObject<EnumObject>;
		type SettableMetaObject = SettableObject<MetaObject>;
		type SettableHostObject = SettableObject<HostObject>;
		type SettableAdapterObject = SettableObject<AdapterObject>;
		type SettableInstanceObject = SettableObject<InstanceObject>;
		type SettableUserObject = SettableObject<UserObject>;
		type SettableGroupObject = SettableObject<GroupObject>;
		type SettableScriptObject = SettableObject<ScriptObject>;
		type SettableOtherObject = SettableObject<OtherObject>;

		/** Represents the change of a state */
		interface ChangedStateObject<TOld extends StateValue = any, TNew extends StateValue = TOld> extends StateObject {
			common: StateCommon;
			native: Record<string, any>;
			id?: string;
			name?: string;
			channelId?: string;
			channelName?: string;
			deviceId?: string;
			deviceName?: string;
			/** The IDs of enums this state is assigned to. For example ["enum.functions.Licht","enum.rooms.Garten"] */
			enumIds?: string[];
			/** The names of enums this state is assigned to. For example ["Licht","Garten"] */
			enumNames?: string[];
			/** new state */
			state: State<TNew>;
			/** @deprecated Use state instead **/
			newState: State<TNew>;
			/** previous state */
			oldState: State<TOld>;
			/** Name of the adapter instance which set the value, e.g. "system.adapter.web.0" */
			from?: string;
			/** Unix timestamp. Default: current time */
			ts?: number;
			/** Unix timestamp of the last time the value changed */
			lc?: number;
			/** Direction flag: false for desired value and true for actual value. Default: false. */
			ack?: boolean;
		}

		type GetStateCallback<T extends StateValue = any> = (err?: string | null, state?: State<T> | AbsentState) => void | Promise<void>;
		type ExistsStateCallback = (err?: string | null, exists?: Boolean) => void | Promise<void>;

		type GetBinaryStateCallback = (err?: string | null, state?: Buffer) => void | Promise<void>;
		type GetBinaryStatePromise = Promise<NonNullCallbackReturnTypeOf<GetBinaryStateCallback>>;

		type SetStateCallback = (err?: string | null, id?: string) => void | Promise<void>;
		type SetStatePromise = Promise<NonNullCallbackReturnTypeOf<SetStateCallback>>;

		type StateChangeHandler<TOld extends StateValue = any, TNew extends TOld = any> = (obj: ChangedStateObject<TOld, TNew>) => void | Promise<void>;

		type FileChangeHandler<WithFile extends boolean> =
			// Variant 1: WithFile is false, data/mimeType is definitely not there
			[WithFile] extends [false] ? (id: string, fileName: string, size: number, data?: undefined, mimeType?: undefined) => void | Promise<void>
			// Variant 2: WithFile is true, data (and mimeType?) is definitely there
			: [WithFile] extends [true] ? (id: string, fileName: string, size: number, data: Buffer | string, mimeType?: string) => void | Promise<void>
			// Variant 3: WithFile is not known, data/mimeType might be there
			: (id: string, fileName: string, size: number, data?: Buffer | string, mimeType?: string) => void | Promise<void>;

		type SetObjectCallback = (err?: string | null, obj?: { id: string }) => void | Promise<void>;
		type SetObjectPromise = Promise<NonNullCallbackReturnTypeOf<SetObjectCallback>>;

		type GetObjectCallback<T extends string = string> = (err?: string | null, obj?: ObjectIdToObjectType<T> | null) => void;
		type GetObjectPromise<T extends string = string> = Promise<CallbackReturnTypeOf<GetObjectCallback<T>>>;

		type LogLevel = "silly" | "debug" | "info" | "warn" | "error" | "force";

		type ReadFileCallback = (err?: string | null, file?: Buffer | string, mimeType?: string) => void | Promise<void>;
		type ReadFilePromise = Promise<NonNullCallbackReturnTypeOf<ReadFileCallback>>;

		/** Callback information for a passed message */
		interface MessageCallbackInfo {
			/** The original message payload */
			message: string | object;
			/** ID of this callback */
			id: number;
			// ???
			ack: boolean;
			/** Timestamp of this message */
			time: number;
		}
		type MessageCallback = (result?: any) => void | Promise<void>;

		interface Subscription {
			name: string;
			pattern: string | RegExp | string[] | iobJS.SubscribeOptions | iobJS.SubscribeTime | iobJS.AstroSchedule;
		}

		interface SubscribeOptions {
			/** "and" or "or" logic to combine the conditions (default: "and") */
			logic?: "and" | "or";
			/** name is equal or matches to given one or name marches to any item in given list */
			id?: string | string[] | SubscribeOptions[] | RegExp | RegExp[];
			/** name is equal or matches to given one */
			name?: string | string[] | RegExp;
			/** type of change */
			change?: "eq" | "ne" | "gt" | "ge" | "lt" | "le" | "any";
			val?: StateValue;
			/** New value must not be equal to given one */
			valNe?: StateValue;
			/** New value must be greater than given one */
			valGt?: number;
			/** New value must be greater or equal to given one */
			valGe?: number;
			/** New value must be smaller than given one */
			valLt?: number;
			/** New value must be smaller or equal to given one */
			valLe?: number;
			/** Acknowledged state of new value is equal to given one */
			ack?: boolean;
			/** Previous value must be equal to given one */
			oldVal?: StateValue;
			/** Previous value must be not equal to given one */
			oldValNe?: StateValue;
			/** Previous value must be greater than given one */
			oldValGt?: number;
			/** Previous value must be greater or equal given one */
			oldValGe?: number;
			/** Previous value must be smaller than given one */
			oldValLt?: number;
			/** Previous value must be smaller or equal to given one */
			oldValLe?: number;
			/** Acknowledged state of previous value is equal to given one */
			oldAck?: boolean;
			/** New value time stamp must be equal to given one (state.ts == ts) */
			ts?: number;
			/** New value time stamp must be not equal to the given one (state.ts != ts) */
			tsGt?: number;
			/** New value time stamp must be greater than given value (state.ts > ts) */
			tsGe?: number;
			/** New value time stamp must be greater or equal to given one (state.ts >= ts) */
			tsLt?: number;
			/** New value time stamp must be smaller than given one (state.ts < ts) */
			tsLe?: number;
			/** Previous time stamp must be equal to given one (oldState.ts == ts) */
			oldTs?: number;
			/** Previous time stamp must be not equal to the given one (oldState.ts != ts) */
			oldTsGt?: number;
			/** Previous time stamp must be greater than the given value (oldState.ts > ts) */
			oldTsGe?: number;
			/** Previous time stamp must be greater or equal to given one (oldState.ts >= ts) */
			oldTsLt?: number;
			/** Previous time stamp must be smaller than given one (oldState.ts < ts) */
			oldTsLe?: number;
			/** Last change time stamp must be equal to given one (state.lc == lc) */
			lc?: number;
			/** Last change time stamp must be not equal to the given one (state.lc != lc) */
			lcGt?: number;
			/** Last change time stamp must be greater than the given value (state.lc > lc) */
			lcGe?: number;
			/** Last change time stamp must be greater or equal to given one (state.lc >= lc) */
			lcLt?: number;
			/** Last change time stamp must be smaller than given one (state.lc < lc) */
			lcLe?: number;
			/** Previous last change time stamp must be equal to given one (oldState.lc == lc) */
			oldLc?: number;
			/** Previous last change time stamp must be not equal to the given one (oldState.lc != lc) */
			oldLcGt?: number;
			/** Previous last change time stamp must be greater than the given value (oldState.lc > lc) */
			oldLcGe?: number;
			/** Previous last change time stamp must be greater or equal to given one (oldState.lc >= lc) */
			oldLcLt?: number;
			/** Previous last change time stamp must be smaller than given one (oldState.lc < lc) */
			oldLcLe?: number;
			/** Channel ID must be equal or match to given one */
			channelId?: string | string[] | RegExp;
			/** Channel name must be equal or match to given one */
			channelName?: string | string[] | RegExp;
			/** Device ID must be equal or match to given one */
			deviceId?: string | string[] | RegExp;
			/** Device name must be equal or match to given one */
			deviceName?: string | string[] | RegExp;
			/** State belongs to given enum or one enum ID of state satisfy the given regular expression */
			enumId?: string | string[] | RegExp;
			/** State belongs to given enum or one enum name of state satisfy the given regular expression */
			enumName?: string | string[] | RegExp;
			/** New value is from defined adapter */
			from?: string | string[] | RegExp;
			/** New value is not from defined adapter */
			fromNe?: string | string[] | RegExp;
			/** Old value is from defined adapter */
			oldFrom?: string | string[] | RegExp;
			/** Old value is not from defined adapter */
			oldFromNe?: string | string[] | RegExp;
		}

		interface QueryResult extends Iterable<string> {
			/** State-ID */
			[index: number]: string;
			/** Number of matched states */
			length: number;
			/** Contains the error if one happened */
			error?: string;

			/**
			 * Executes a function for each state id in the result array
			 * The execution is canceled if a callback returns false
			 */
			each(callback?: (id: string, index: number) => boolean | void | Promise<void>): this;

			/**
			 * Returns the first state found by this query.
			 * If the adapter is configured to subscribe to all states on start,
			 * this can be called synchronously and immediately returns the state.
			 * Otherwise, you need to provide a callback.
			 */
			getState<T extends StateValue = any>(callback: GetStateCallback<T>): void;
			getState<T extends StateValue = any>(): State<T> | null | undefined;
			getStateAsync<T extends StateValue = any>(): Promise<State<T> | null | undefined>;

			/**
			 * Returns the first state found by this query.
			 * If the adapter is configured to subscribe to all states on start,
			 * this can be called synchronously and immediately returns the state.
			 * Otherwise, you need to provide a callback.
			 */
			getBinaryState(callback: GetBinaryStateCallback): void;
			getBinaryState(): Buffer | null | undefined;
			getBinaryStateAsync(): Promise<Buffer | null | undefined>;

			/**
			 * Sets all queried states to the given value.
			 */
			setState(state: State | StateValue | SettableState, ack?: boolean, callback?: SetStateCallback): this;
			setStateAsync(state: State | StateValue | SettableState, ack?: boolean): Promise<void>;
			setStateDelayed(state: any, isAck?: boolean, delay?: number, clearRunning?: boolean, callback?: SetStateCallback): this;

			/**
			 * Sets all queried binary states to the given value.
			 */
			setBinaryState(state: Buffer, ack?: boolean, callback?: SetStateCallback): this;
			setBinaryStateAsync(state: Buffer, ack?: boolean): Promise<void>;

			/**
			 * Subscribes the given callback to changes of the matched states.
			 */
			on(callback: StateChangeHandler): this;
		}

		/**
		 * * "sunrise": sunrise (top edge of the sun appears on the horizon)
		 * * "sunriseEnd": sunrise ends (bottom edge of the sun touches the horizon)
		 * * "goldenHourEnd": morning golden hour (soft light, best time for photography) ends
		 * * "solarNoon": solar noon (sun is in the highest position)
		 * * "goldenHour": evening golden hour starts
		 * * "sunsetStart": sunset starts (bottom edge of the sun touches the horizon)
		 * * "sunset": sunset (sun disappears below the horizon, evening civil twilight starts)
		 * * "dusk": dusk (evening nautical twilight starts)
		 * * "nauticalDusk": nautical dusk (evening astronomical twilight starts)
		 * * "night": night starts (dark enough for astronomical observations)
		 * * "nightEnd": night ends (morning astronomical twilight starts)
		 * * "nauticalDawn": nautical dawn (morning nautical twilight starts)
		 * * "dawn": dawn (morning nautical twilight ends, morning civil twilight starts)
		 * * "nadir": nadir (darkest moment of the night, sun is in the lowest position)
		 */
		type AstroPattern = "sunrise" | "sunriseEnd" | "goldenHourEnd" | "solarNoon" | "goldenHour" | "sunsetStart" | "sunset" | "dusk" | "nauticalDusk" | "night" | "nightEnd" | "nauticalDawn" | "dawn" | "nadir";

		interface AstroSchedule {
			astro: AstroPattern;
			/**
			 * Shift to the astro schedule.
			 */
			shift?: number;
		}

		interface AstroDate {
			astro: AstroPattern;
			/** Offset to the astro event in minutes */
			offset?: number;
			/** Date for which the astro time is wanted */
			date?: Date;
		}

		/**
		 * from https://github.com/node-schedule/node-schedule
		 */
		interface ScheduleRule {
			/**
			 * Day of the month.
			 */
			date?: number | number[] | string | string[];

			/**
			 * Day of the week.
			 */
			dayOfWeek?: number | number[] | string | string[];

			/**
			 * Hour.
			 */
			hour?: number | number[] | string | string[];

			/**
			 * Minute.
			 */
			minute?: number | number[] | string | string[];

			/**
			 * Month.
			 */
			month?: number | number[] | string | string[];

			/**
			 * Second.
			 */
			second?: number | number[] | string | string[];

			/**
			 * Year.
			 */
			year?: number | number[] | string | string[];
			/**
			 * timezone which should be used
			 * https://github.com/moment/moment-timezone
			 */
			tz?: string;
		}

		/**
		 * from https://github.com/node-schedule/node-schedule
		 */
		interface ScheduleRuleConditional {
			/**
			 * set a start time for schedule
			 * a Data object or a dateString resp a number in milliseconds which can create a Date object
			 */
			start?: Date | string | number;
			/**
			 * set an end time for schedule
			 * a Data object or a dateString resp a number in milliseconds which can create a Date object
			 */
			end?: Date | string | number;
			/**
			 * timezone which should be used
			 * https://github.com/moment/moment-timezone
			 */
			tz?: string;
			/**
			 * scheduling rule
			 * schedule rule, a Data object or a dateString resp a number in milliseconds which can create a Date object
			 */
			rule: ScheduleRule | Date | string | number;
		}

		interface LogMessage {
			severity: LogLevel; // severity
			ts: number; 		// timestamp as Date.now()
			message: string; 	// message
			from: string; 		// origin of the message
		}

		type SchedulePattern = ScheduleRule | ScheduleRuleConditional | Date | string | number;

		interface SubscribeTime {
			time: SchedulePattern;
		}

		interface StateTimer {
			id: number;
			left: number;
			delay: number;
			val: any;
			ack: boolean;
		}

		type MessageSubscribeID = number;
		interface MessageTarget {
			/** Javascript Instance */
			instance?: string;
			/** Script name */
			script?: string;
			/** Message name */
			message: string;
		}
	} // end namespace iobJS

	// =======================================================
	// available functions in the sandbox
	// =======================================================

	// The already preloaded request module
	const request: typeof import("request");

	/**
	 * The instance number of the JavaScript adapter this script runs in
	 */
	const instance: number;
	/**
	 * The name of the current script
	 */
	// @ts-ignore We need this variable, although it conflicts with lib.es6
	const name: string;
	/**
	 * The name of the current script
	 */
	const scriptName: string;

	/**
	 * Queries all states with the given selector
	 * @param selector See @link{https://github.com/ioBroker/ioBroker.javascript#---selector} for a description
	 */
	// @ts-ignore We need this function, although it conflicts with vue
	function $(selector: string): iobJS.QueryResult;

	/**
	 * Prints a message in the ioBroker log
	 * @param message The message to print
	 * @param severity (optional) severity of the message. default = "info"
	 */
	function log(message: string, severity?: iobJS.LogLevel): void;

	// console functions
	// @ts-ignore We need this variable, although it conflicts with the node typings
	namespace console {
		/** log a message with debug level */
		function debug(message: string): void;
		/** log a message with info level (default output level for all adapters) */
		function info(message: string): void;
		/** log a message with warning severity */
		function warn(message: string): void;
		/** log a message with error severity */
		function error(message: string): void;
	}

	/**
	 * Executes a system command
	 */
	const exec: typeof import("child_process").exec;

	/**
	 * Sends an email using the email adapter.
	 * See the adapter documentation for a description of the msg parameter.
	 */
	function email(msg: any): void;

	/**
	 * Sends a pushover message using the pushover adapter.
	 * See the adapter documentation for a description of the msg parameter.
	 */
	function pushover(msg: any): void;

	/**
	 * Subscribe to the changes of the matched states.
	 */
	function on(pattern: string | RegExp | string[], handler: iobJS.StateChangeHandler): any;
	function on(
		astroOrScheduleOrOptions: iobJS.AstroSchedule | iobJS.SubscribeTime | iobJS.SubscribeOptions,
		handler: iobJS.StateChangeHandler
	): any;
	/**
	 * Subscribe to the changes of the matched states.
	 */
	function subscribe(pattern: string | RegExp | string[], handler: iobJS.StateChangeHandler): any;
	function subscribe(
		astroOrScheduleOrOptions: iobJS.AstroSchedule | iobJS.SubscribeTime | iobJS.SubscribeOptions,
		handler: iobJS.StateChangeHandler
	): any;

	/**
	 * Subscribe to the changes of the matched files.
	 * The return value can be used for offFile later
	 * @param id ID of meta-object, like `vis.0`
	 * @param filePattern File name or file pattern, like `main/*`
	 * @param withFile If the content of the file must be returned in callback (high usage of memory)
	 * @param handler Callback: function (id, fileName, size, data, mimeType) {}
	 */
	function onFile<WithFile extends boolean>(id: string, filePattern: string | string[], withFile: WithFile, handler: iobJS.FileChangeHandler<WithFile>): any;
	function onFile(id: string, filePattern: string | string[], handler: iobJS.FileChangeHandler<false>): any;

	/**
	 * Un-subscribe from the changes of the matched files.
	 * @param id ID of meta-object, like `vis.0`. You can provide here can be a returned object from onFile. In this case, no filePattern required.
	 * @param filePattern File name or file pattern, like `main/*`
	 */
	function offFile(id: string | any, filePattern?: string | string[]): boolean;

	/**
	 * Registers a one-time subscription which automatically unsubscribes after the first invocation
	 */
	function once(
		pattern: string | RegExp | string[] | iobJS.AstroSchedule | iobJS.SubscribeTime | iobJS.SubscribeOptions,
		handler: iobJS.StateChangeHandler
	): any;
	function once(
		pattern: string | RegExp | string[] | iobJS.AstroSchedule | iobJS.SubscribeTime | iobJS.SubscribeOptions
	): Promise<iobJS.ChangedStateObject>;

	/**
	 * Causes all changes of the state with id1 to the state with id2.
	 * The return value can be used to unsubscribe later
	 */
	function on(id1: string, id2: string): any;
	/**
	 * Watches the state with id1 for changes and overwrites the state with id2 with value2 when any occur.
	 * @param id1 The state to watch for changes
	 * @param id2 The state to update when changes occur
	 * @param value2 The value to write into state `id2` when `id1` gets changed
	 */
	function on(id1: string, id2: string, value2: any): any;

	/**
	 * Causes all changes of the state with id1 to the state with id2
	 */
	function subscribe(id1: string, id2: string): any;
	/**
	 * Watches the state with id1 for changes and overwrites the state with id2 with value2 when any occur.
	 * @param id1 The state to watch for changes
	 * @param id2 The state to update when changes occur
	 * @param value2 The value to write into state `id2` when `id1` gets changed
	 */
	function subscribe(id1: string, id2: string, value2: any): any;

	/**
	 * Returns the list of all currently active subscriptions
	 */
	function getSubscriptions(): { [id: string]: iobJS.Subscription[] };

	/**
	 * Unsubscribe from changes of the given object ID(s) or handler(s)
	 */
	function unsubscribe(id: string | string[]): boolean;
	function unsubscribe(handler: any | any[]): boolean;

	function adapterSubscribe(id: string): void;
	function adapterUnsubscribe(id: string): void;

	/**
	 * Schedules a function to be executed on a defined schedule.
	 * The return value can be used to clear the schedule later.
	 */
	function schedule(pattern: string | iobJS.SchedulePattern, callback: EmptyCallback): any;
	function schedule(date: Date, callback: EmptyCallback): any;
	function schedule(astro: iobJS.AstroSchedule, callback: EmptyCallback): any;
	/**
	 * Clears a schedule. Returns true if it was successful.
	 */
	function clearSchedule(schedule: any): boolean;

	/**
	 * Calculates the astro time which corresponds to the given pattern.
	 * For valid patterns, see @link{https://github.com/ioBroker/ioBroker.javascript/blob/master/docs/en/javascript.md#astro-function}
	 * @param pattern One of predefined patterns, like: sunrise, sunriseEnd, ...
	 * @param date (optional) The date for which the astro time should be calculated. Default = today
	 * @param offsetMinutes (optional) The number of minutes to be added to the return value.
	 */
	function getAstroDate(pattern: string, date?: Date | number, offsetMinutes?: number): Date;

	/**
	 * Determines if now is between sunrise and sunset.
	 */
	function isAstroDay(): boolean;

	/**
	 * Sets a state to the given value
	 * @param id The ID of the state to be set
	 */
	function setState(id: string, state: iobJS.State | iobJS.StateValue | iobJS.SettableState, callback?: iobJS.SetStateCallback): void;
	function setState(id: string, state: iobJS.State | iobJS.StateValue | iobJS.SettableState, ack: boolean, callback?: iobJS.SetStateCallback): void;

	function setStateAsync(id: string, state: iobJS.State | iobJS.StateValue | iobJS.SettableState, ack?: boolean): iobJS.SetStatePromise;

	/**
	 * Sets a state to the given value after a timeout has passed.
	 * Returns the timer, so it can be manually cleared with clearStateDelayed
	 * @param id The ID of the state to be set
	 * @param delay The delay in milliseconds
	 * @param clearRunning (optional) Whether an existing timeout for this state should be cleared
	 * @returns If a delayed setState was scheduled, this returns the timer id, otherwise null.
	 */
	function setStateDelayed(id: string, state: iobJS.State | iobJS.StateValue | iobJS.SettableState, delay: number, clearRunning: boolean, callback?: iobJS.SetStateCallback): number | null;
	function setStateDelayed(id: string, state: iobJS.State | iobJS.StateValue | iobJS.SettableState, ack: boolean, clearRunning: boolean, callback?: iobJS.SetStateCallback): number | null;
	function setStateDelayed(id: string, state: iobJS.State | iobJS.StateValue | iobJS.SettableState, ack: boolean, delay: number, callback?: iobJS.SetStateCallback): number | null;
	function setStateDelayed(id: string, state: iobJS.State | iobJS.StateValue | iobJS.SettableState, delay: number, callback?: iobJS.SetStateCallback): number | null;
	function setStateDelayed(id: string, state: iobJS.State | iobJS.StateValue | iobJS.SettableState, callback?: iobJS.SetStateCallback): number | null;
	function setStateDelayed(id: string, state: iobJS.State | iobJS.StateValue | iobJS.SettableState, ack: boolean, delay: number, clearRunning: boolean, callback?: iobJS.SetStateCallback): number | null;

	/**
	 * Clears a timer created by setStateDelayed
	 * @param id The state id for which the timer should be cleared
	 * @param timerID (optional) ID of the specific timer to clear. If none is given, all timers are cleared.
	 */
	function clearStateDelayed(id: string, timerID?: number): boolean;

	/**
	 * Returns information about a specific timer created with `setStateDelayed`.
	 * @param timerId The timer id that was returned by `setStateDelayed`.
	 */
	function getStateDelayed(timerId: number): iobJS.StateTimer | null;
	/**
	 * Returns a list of all timers created with `setStateDelayed`. Can be limited to a specific state id.
	 * @param id The state id for which the timers should be.
	 */
	function getStateDelayed(id?: string): iobJS.StateTimer[];

	/**
	 * Sets a binary state to the given value
	 * @param id The ID of the state to be set
	 * @param state binary data as buffer
	 * @param callback called when the operation finished
	 */
	function setBinaryState(id: string, state: Buffer, callback?: iobJS.SetStateCallback): void;
	function setBinaryStateAsync(id: string, state: Buffer): iobJS.SetStatePromise;

	/**
	 * Returns the state with the given ID.
	 * If the adapter is configured to subscribe to all states on start,
	 * this can be called synchronously and immediately returns the state.
	 * Otherwise, you need to provide a callback.
	 */
	function getState<T extends iobJS.StateValue = any>(id: string, callback: iobJS.GetStateCallback<T>): void;
	function getState<T extends iobJS.StateValue = any>(id: string): iobJS.State<T> | iobJS.AbsentState;
	function getStateAsync<T extends iobJS.StateValue = any>(id: string): Promise<iobJS.State<T>>;

	/**
	 * Returns the binary state with the given ID.
	 * If the adapter is configured to subscribe to all states on start,
	 * this can be called synchronously and immediately returns the state.
	 * Otherwise, you need to provide a callback.
	 */
	function getBinaryState(id: string, callback: iobJS.GetStateCallback): void;
	function getBinaryState(id: string): Buffer;
	function getBinaryStateAsync(id: string): iobJS.GetBinaryStatePromise;

	/**
	 * Checks if the state with the given ID exists
	 */
	function existsState(id: string, callback: iobJS.ExistsStateCallback): void;
	function existsState(id: string): boolean;
	function existsStateAsync(id: string): Promise<boolean>;
	/**
	 * Checks if the object with the given ID exists
	 */
	function existsObject(id: string): boolean;
	function existsObjectAsync(id: string): Promise<boolean>;

	/**
	 * Returns the IDs of the states with the given name
	 * @param name Name of the state
	 * @param forceArray (optional) Ensures that the return value is always an array, even if only one ID was found.
	 */
	function getIdByName(name: string, forceArray?: boolean): string | string[];

	/**
	 * Reads an object from the object db.
	 * @param enumName Which enum should be included in the returned object. `true` to return all enums.
	 */
	function getObject<T extends string>(id: T, enumName?: string | true): iobJS.ObjectIdToObjectType<T, "read">;
	function getObject<T extends string>(id: T, callback: iobJS.GetObjectCallback<T>): void;
	function getObject<T extends string>(id: T, enumName: string | true, callback: iobJS.GetObjectCallback<T>): void;
	function getObjectAsync<T extends string>(id: T, enumName?: string | true): iobJS.GetObjectPromise<T>;

	/** Creates or overwrites an object in the object db */
	function setObject(id: string, obj: iobJS.SettableObject, callback?: iobJS.SetObjectCallback): void;
	function setObjectAsync(id: string, obj: iobJS.SettableObject): iobJS.SetObjectPromise;
	/** Extend an object and create it if it might not exist */
	function extendObject(id: string, objPart: iobJS.PartialObject, callback?: iobJS.SetObjectCallback): void;
	function extendObjectAsync(id: string, objPart: iobJS.PartialObject): iobJS.SetObjectPromise;

	/** Deletes an object in the object db */
	function deleteObject(id: string, callback?: ErrorCallback): void;
	function deleteObject(id: string, recursive: boolean, callback?: ErrorCallback): void;
	function deleteObjectAsync(id: string, recursive?: boolean): Promise<void>;

	function getEnums(enumName?: string): any;

	/**
	 * Creates a state and the corresponding object under the javascript namespace.
	 * @param name The name of the state without the namespace
	 * @param initValue (optional) Initial value of the state
	 * @param forceCreation (optional) Override the state if it already exists
	 * @param common (optional) Common part of the state object
	 * @param native (optional) Native part of the state object
	 * @param callback (optional) Called after the state was created
	 */
	function createState(name: string, callback?: iobJS.SetStateCallback): void;
	function createState(name: string, initValue: iobJS.StateValue, callback?: iobJS.SetStateCallback): void;
	function createState(name: string, initValue: iobJS.StateValue, forceCreation: boolean, callback?: iobJS.SetStateCallback): void;
	function createState(name: string, initValue: iobJS.StateValue, forceCreation: boolean, common: Partial<iobJS.StateCommon>, callback?: iobJS.SetStateCallback): void;
	function createState(name: string, initValue: iobJS.StateValue, forceCreation: boolean, common: Partial<iobJS.StateCommon>, native: any, callback?: iobJS.SetStateCallback): void;
	function createState(name: string, common: Partial<iobJS.StateCommon>, callback?: iobJS.SetStateCallback): void;
	function createState(name: string, initValue: iobJS.StateValue, common: Partial<iobJS.StateCommon>, callback?: iobJS.SetStateCallback): void;
	function createState(name: string, common: Partial<iobJS.StateCommon>, native: any, callback?: iobJS.SetStateCallback): void;
	function createState(name: string, initValue: iobJS.StateValue, common: Partial<iobJS.StateCommon>, native: any, callback?: iobJS.SetStateCallback): void;

	function createStateAsync(name: string, initValue?: iobJS.StateValue, forceCreation?: boolean, common?: Partial<iobJS.StateCommon>, native?: any): iobJS.SetStatePromise;
	function createStateAsync(name: string, common: Partial<iobJS.StateCommon>): iobJS.SetStatePromise;
	function createStateAsync(name: string, common: Partial<iobJS.StateCommon>, native?: any): iobJS.SetStatePromise;
	function createStateAsync(name: string, initValue: iobJS.StateValue, common: Partial<iobJS.StateCommon>): iobJS.SetStatePromise;
	function createStateAsync(name: string, initValue: iobJS.StateValue, common: Partial<iobJS.StateCommon>, native?: any): iobJS.SetStatePromise;

	function createAlias(name: string, alias: string | iobJS.StateCommonAlias, callback?: iobJS.SetStateCallback): void;
	function createAlias(name: string, alias: string | iobJS.StateCommonAlias, forceCreation: boolean, callback?: iobJS.SetStateCallback): void;
	function createAlias(name: string, alias: string | iobJS.StateCommonAlias, forceCreation: boolean, common: Partial<iobJS.StateCommon>, callback?: iobJS.SetStateCallback): void;
	function createAlias(name: string, alias: string | iobJS.StateCommonAlias, forceCreation: boolean, common: Partial<iobJS.StateCommon>, native: any, callback?: iobJS.SetStateCallback): void;
	function createAlias(name: string, alias: string | iobJS.StateCommonAlias, common: Partial<iobJS.StateCommon>, callback?: iobJS.SetStateCallback): void;
	function createAlias(name: string, alias: string | iobJS.StateCommonAlias, common: Partial<iobJS.StateCommon>, native: any, callback?: iobJS.SetStateCallback): void;

	function createAliasAsync(name: string, alias: string | iobJS.StateCommonAlias, forceCreation?: boolean, common?: Partial<iobJS.StateCommon>, native?: any): iobJS.SetStatePromise;
	function createAliasAsync(name: string, alias: string | iobJS.StateCommonAlias, common: Partial<iobJS.StateCommon>): iobJS.SetStatePromise;
	function createAliasAsync(name: string, alias: string | iobJS.StateCommonAlias, common: Partial<iobJS.StateCommon>, native?: any): iobJS.SetStatePromise;



	/**
	 * Deletes the state with the given ID
	 * @param callback (optional) Is called after the state was deleted (or not).
	 */
	function deleteState(id: string, callback?: GenericCallback<boolean>): void;
	function deleteStateAsync(id: string): Promise<boolean>;

	/**
	 * Sends a message to a specific instance or all instances of some specific adapter.
	 * @param instanceName The instance to send this message to.
	 * If the ID of an instance is given (e.g. "admin.0"), only this instance will receive the message.
	 * If the name of an adapter is given (e.g. "admin"), all instances of this adapter will receive it.
	 * @param command (optional) Command name of the target instance. Default: "send"
	 * @param message The message (e.g., params) to send.
	 */
	function sendTo(instanceName: string, command: string, message: string | object, callback?: iobJS.MessageCallback | iobJS.MessageCallbackInfo): void;
	function sendTo(instanceName: string, message: string | object, callback?: iobJS.MessageCallback | iobJS.MessageCallbackInfo): void;
	function sendToAsync(instanceName: string, message: string | object): Promise<iobJS.MessageCallback | iobJS.MessageCallbackInfo>;
	function sendToAsync(instanceName: string, command: string, message: string | object): Promise<iobJS.MessageCallback | iobJS.MessageCallbackInfo>;

	/**
	 * Sends a message to a specific instance or all instances of some specific adapter.
	 * @param host Host name.
	 * @param command Command name for the target host.
	 * @param message The message (e.g., params) to send.
	 */
	function sendToHost(host: string, command: string, message: string | object, callback?: iobJS.MessageCallback | iobJS.MessageCallbackInfo): void;
	function sendToHostAsync(host: string, command: string, message: string | object): Promise<iobJS.MessageCallback | iobJS.MessageCallbackInfo>;

	type CompareTimeOperations =
		"between" | "not between" |
		">" | ">=" | "<" | "<=" | "==" | "<>"
		;

	/**
	 * Compares two or more times
	 * @param timeToCompare - The time to compare with startTime and/or endTime. If none is given, the current time is used
	 */
	function compareTime(
		startTime: string | number | Date | iobJS.AstroDate,
		endTime: string | number | Date | iobJS.AstroDate,
		operation: CompareTimeOperations,
		timeToCompare?: string | number | Date | iobJS.AstroDate,
	): boolean;

	/** Sets up a callback which is called when the script stops */
	function onStop(callback: (cb?: EmptyCallback) => void, timeout?: number): void;

	function formatValue(value: number | string, format?: any): string;
	function formatValue(value: number | string, decimals: number, format?: any): string;
	function formatDate(dateObj: string | Date | number, format: string, language?: string): string;
	function formatDate(dateObj: string | Date | number, isDuration: boolean | string, format: string, language?: string): string;

	function getDateObject(date: number | string | Date): Date;

	/**
	 * Writes a file.
	 * @param id Name of the root directory. This should be the adapter instance, e.g. "admin.0"
	 * @param name File name
	 * @param data Contents of the file
	 * @param callback Is called when the operation has finished (successfully or not)
	 */
	function writeFile(id: string, name: string, data: Buffer | string, callback: ErrorCallback): void;
	function writeFileAsync(id: string, name: string, data: Buffer | string): Promise<void>;

	/**
	 * Reads a file.
	 * @param id Name of the root directory. This should be the adapter instance, e.g. "admin.0"
	 * @param name File name
	 * @param callback Is called when the operation has finished (successfully or not)
	 */
	function readFile(id: string, name: string, callback: iobJS.ReadFileCallback): void;
	function readFileAsync(id: string, name: string): iobJS.ReadFilePromise;

	/**
	 * Deletes a file.
	 * @param id Name of the root directory. This should be the adapter instance, e.g. "admin.0"
	 * @param name File name
	 * @param callback Is called when the operation has finished (successfully or not)
	 */
	function unlink(id: string, name: string, callback: ErrorCallback): void;
	function unlinkAsync(id: string, name: string): Promise<void>;

	/**
	 * Deletes a file.
	 * @param id Name of the root directory. This should be the adapter instance, e.g. "admin.0"
	 * @param name File name
	 * @param callback Is called when the operation has finished (successfully or not)
	 */
	function delFile(id: string, name: string, callback: ErrorCallback): void;
	function delFileAsync(id: string, name: string): Promise<void>;

	function getHistory(instance: any, options: any, callback: any): any;
	function getHistoryAsync(instance: any, options: any): Promise<any>;

	/**
	 * Starts or restarts a script by name
	 * @param scriptName (optional) Name of the script. If none is given, the current script is (re)started.
	 */
	function runScript(scriptName?: string, callback?: ErrorCallback): boolean;
	function runScriptAsync(scriptName?: string): Promise<void>;

	/**
	 * Starts or restarts a script by name
	 * @param scriptName (optional) Name of the script. If none is given, the current script is (re)started.
	 * @param ignoreIfStarted If set to true, running scripts will not be restarted.
	 * @param callback (optional) Is called when the script has finished (successfully or not)
	 */
	function startScript(scriptName: string | undefined, ignoreIfStarted: boolean, callback?: GenericCallback<boolean>): boolean;
	function startScriptAsync(scriptName?: string | undefined, ignoreIfStarted?: boolean): Promise<void>;

	/**
	 * Starts or restarts a script by name
	 * @param scriptName (optional) Name of the script. If none is given, the current script is (re)started.
	 * @param callback (optional) Is called when the script has finished (successfully or not)
	 */
	function startScript(scriptName?: string, callback?: GenericCallback<boolean>): boolean;
	/**
	 * Stops a script by name
	 * @param scriptName (optional) Name of the script. If none is given, the current script is stopped.
	 */
	function stopScript(scriptName: string | undefined, callback?: GenericCallback<boolean>): boolean;
	function stopScriptAsync(scriptName?: string): Promise<void>;

	function isScriptActive(scriptName: string): boolean;

	/** Converts a value to an integer */
	function toInt(val: any): number;
	/** Converts a value to a floating point number */
	function toFloat(val: any): number;
	/** Converts a value to a boolean */
	function toBoolean(val: any): boolean;

	/**
	 * Digs in an object for the property value at the given path.
	 * @param obj The object to dig in
	 * @param path The path of the property to dig for in the given object
	 */
	function getAttr(obj: string | Record<string, any>, path: string | string[]): any;

	/**
	 * Sends a message to another script.
	 * @param target Message name or target object
	 * @param data Any data, that should be sent to message bus
	 * @param options Actually only {timeout: X} is supported as option
	 * @param callback Callback to get the result from other script
	 * @return ID of the subscription. It could be used for un-subscribe.
	 */
	function messageTo(target: iobJS.MessageTarget | string, data: any, options?: any, callback?: SimpleCallback<any>): iobJS.MessageSubscribeID;
	function messageToAsync(target: iobJS.MessageTarget | string, data: any, options?: any): Promise<iobJS.MessageCallback | iobJS.MessageCallbackInfo>;

	/**
	 * Process message from another script.
	 * @param message Message name
	 * @param callback Callback to send the result to another script
	 */
	function onMessage(message: string, callback?: SimpleCallback<any>);

	/**
	 * Unregister onmessage handler
	 * @param id Message subscription id from onMessage or by message name
	 * @return true if subscription exists and was deleted.
	 */
	function onMessageUnregister(id: iobJS.MessageSubscribeID | string): boolean;

	/**
	 * Receives logs of specified severity level in a script.
	 * @param severity Severity level
	 * @param callback Callback to send the result to another script
	 */
	function onLog(severity: iobJS.LogLevel | "*", callback: SimpleCallback<iobJS.LogMessage>);

	/**
	 * Unsubscribe log handler.
	 * @param idOrCallbackOrSeverity Message subscription id from onLog or by callback function
	 * @return true if subscription exists and was deleted.
	 */
	function onLogUnregister(idOrCallbackOrSeverity: iobJS.MessageSubscribeID | SimpleCallback<iobJS.LogMessage> | iobJS.LogLevel | "*"): boolean;

	/** `await` this method to pause for the given number of milliseconds */
	function wait(ms: number): Promise<void>;

	/** `await` this method to pause for the given number of milliseconds */
	function sleep(ms: number): Promise<void>;
}
