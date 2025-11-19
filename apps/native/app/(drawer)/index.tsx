import { Text, View } from "react-native";
import { Container } from "@/components/container";
import { Ionicons } from "@expo/vector-icons";
import { Card, Chip, useThemeColor } from "heroui-native";

export default function Home() {
	const mutedColor = useThemeColor("muted");
	const successColor = useThemeColor("success");
	const dangerColor = useThemeColor("danger");

	return (
		<Container className="p-6">
			<View className="py-4 mb-6">
				<Text className="text-4xl font-bold text-foreground mb-2">
					BETTER T STACK
				</Text>
			</View>

			<Card variant="secondary" className="p-6">
				<View className="flex-row items-center justify-between mb-4">
					<Card.Title>System Status</Card.Title>
					<Chip
						variant="secondary"
						color={isConnected ? "success" : "danger"}
						size="sm"
					>
						<Chip.Label>{isConnected ? "LIVE" : "OFFLINE"}</Chip.Label>
					</Chip>
				</View>
				<Card className="p-4">
					<View className="flex-row items-center">
						<View
							className={`w-3 h-3 rounded-full mr-3 ${
								isConnected ? "bg-success" : "bg-muted"
							}`}
						/>
						<View className="flex-1">
							<Text className="text-foreground font-medium mb-1"></Text>
							<Card.Description>
								{isLoading
									? "Checking connection..."
									: isConnected
										? "Connected to API"
										: "API Disconnected"}
							</Card.Description>
						</View>
						{isLoading && (
							<Ionicons name="hourglass-outline" size={20} color={mutedColor} />
						)}
						{!isLoading && isConnected && (
							<Ionicons
								name="checkmark-circle"
								size={20}
								color={successColor}
							/>
						)}
						{!isLoading && !isConnected && (
							<Ionicons name="close-circle" size={20} color={dangerColor} />
						)}
					</View>
				</Card>
			</Card>
		</Container>
	);
}
