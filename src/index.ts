import { InstanceBase, runEntrypoint, InstanceStatus, SomeCompanionConfigField } from '@companion-module/base'
import { GetConfigFields, type ModuleConfig } from './config.js'
import { UpdateVariableDefinitions } from './variables.js'
import { UpgradeScripts } from './upgrades.js'
import { UpdateActions } from './actions.js'
import { UpdateFeedbacks } from './feedbacks.js'
import { initConnection } from './api.js'

export class evolutionInstance extends InstanceBase<ModuleConfig> {
	config!: ModuleConfig // Setup in init()

	public _muteState: boolean
	public _deviceConfig: any
	public _deviceConfigIndex: number
	public device: any

	public _socket: any

	public _pushInterval: NodeJS.Timeout | undefined
	public responseTimeout?: NodeJS.Timeout

	constructor(internal: unknown) {
		super(internal)

		this._muteState = false
		this._deviceConfig = {
			af_peak: null,
			equalizer: {
				enabled: false,
				low: null,
				lowMid: null,
				mid: null,
				midHigh: null,
				high: null
			},
			frequency: null,
			name: null,
			sensitivity: null,
		}
		this._deviceConfigIndex = 0
	}

	async init(config: ModuleConfig): Promise<void> {
		this.config = config

		this.device = {
			deviceConnected: false,
		}

		this.updateStatus(InstanceStatus.Ok)

		this.updateActions() // export actions
		this.updateFeedbacks() // export feedbacks
		this.updateVariableDefinitions() // export variable definitions

		this.initConnection()
	}
	// When module gets deleted
	async destroy(): Promise<void> {
		this.log('debug', 'destroy')
	}

	async configUpdated(config: ModuleConfig): Promise<void> {
		this.config = config

		this.initConnection()
	}

	// Return config fields for web config
	getConfigFields(): SomeCompanionConfigField[] {
		return GetConfigFields()
	}

	updateActions(): void {
		UpdateActions(this)
	}

	updateFeedbacks(): void {
		UpdateFeedbacks(this)
	}

	updateVariableDefinitions(): void {
		UpdateVariableDefinitions(this)
	}

	initConnection(): void {
		initConnection(this)
	}
}

runEntrypoint(evolutionInstance, UpgradeScripts)
