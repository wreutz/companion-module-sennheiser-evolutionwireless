import { CompanionFeedbackDefinitions } from '@companion-module/base'
import { graphics } from 'companion-module-utils'
import { images } from './graphics.js'
import {
	// OptionsCorner,
	// OptionsRect,
	OptionsIcon,
	// OptionsBar,
	// OptionsCircle,
	// eslint-disable-next-line n/no-missing-import
} from 'companion-module-utils/dist/graphics.js'
import type { evolutionInstance } from './index.js'

export function UpdateFeedbacks(self: evolutionInstance): void {
	const feedbacks: CompanionFeedbackDefinitions = {}

	if (self.config.deviceType === 'SR') {
		feedbacks.senderState = {
			name: 'IEM: Status Display',
			description: 'Displays detailed information about the IEM sender',
			type: 'advanced',
			options: [],
			callback: async (feedback) => {
				if (feedback.image) {
					const commonIconProps: OptionsIcon = {
						width: feedback.image.width,
						height: feedback.image.height,
						type: 'custom',
					}
					if (self.device.deviceConnected) {
						return {
							text: '\\nCONNECTED',
						}
					} else {
						const warningProps: OptionsIcon = {
							...commonIconProps,
							offsetX: feedback.image.width / 2 - 8,
							offsetY: 8,
							customWidth: 16,
							customHeight: 16,
						}

						return {
							imageBuffer: graphics.icon({
								...warningProps,
								custom: images.disconnected,
							}),
							text: '\\nIEM not connected',
						}
					}
				} else {
					return {
						imageBuffer: new Uint8Array(),
					}
				}
			}
		}
	}

	self.setFeedbackDefinitions(feedbacks)
}
