import React from "react"
import { useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar, Alert } from "react-native"
import { ArrowLeft, ArrowRight, Check } from "lucide-react-native"
import PersonalInfoStep from "../../components/registration/PersonalInfoStep"
import ContactInfoStep from "../../components/registration/ContactInfoStep"
import SecurityStep from "../../components/registration/SecurityStep"
import VerificationStep from "../../components/registration/VerificationStep"
import AccountSetupStep from "../../components/registration/AccountSetupStep"
import { AuthContext } from '../../context/AuthContext';
import axios from "axios"

interface RegistrationData {
    // Personal Info
    firstName: string
    lastName: string
    dateOfBirth: string

    // Contact Info
    email: string
    phone: string
    address: string
    city: string
    state: string
    postalCode: string
    country: string

    // Security
    password: string
    confirmPassword: string
    securityQuestion: string
    securityAnswer: string

    // Verification
    emailVerified: boolean
    phoneVerified: boolean

    // Account Setup
    accountType: string
    initialDeposit: string
    agreeToTerms: boolean
}

const steps = [
    { id: 1, title: "Personal Info", subtitle: "Basic information" },
    { id: 2, title: "Contact Details", subtitle: "Address & contact" },
    { id: 3, title: "Security", subtitle: "Password & security" },
    { id: 4, title: "Verification", subtitle: "Verify your identity" },
    { id: 5, title: "Account Setup", subtitle: "Choose account type" },
]

export default function RegisterScreen({ navigation }: { navigation: any }) {
    const { login } = useContext(AuthContext);

    const [currentStep, setCurrentStep] = React.useState(1)
    const [registrationData, setRegistrationData] = React.useState<RegistrationData>({
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        postalCode: "",
        country: "USA",
        password: "",
        confirmPassword: "",
        securityQuestion: "",
        securityAnswer: "",
        emailVerified: true,
        phoneVerified: true,
        accountType: "checking",
        initialDeposit: "",
        agreeToTerms: false,
    })

    const updateRegistrationData = (data: Partial<RegistrationData>) => {
        setRegistrationData((prev) => ({ ...prev, ...data }))
    }

    const validateCurrentStep = (): boolean => {
        switch (currentStep) {
            case 1:
                return !!(registrationData.firstName && registrationData.lastName && registrationData.dateOfBirth)
            case 2:
                return !!(registrationData.email && registrationData.phone && registrationData.address && registrationData.city)
            case 3:
                return !!(
                    registrationData.password &&
                    registrationData.confirmPassword &&
                    registrationData.password === registrationData.confirmPassword &&
                    registrationData.securityQuestion &&
                    registrationData.securityAnswer
                )
            case 4:
                return registrationData.emailVerified && registrationData.phoneVerified
            case 5:
                return !!(registrationData.accountType && registrationData.agreeToTerms)
            default:
                return false
        }
    }

    const handleNext = () => {
        if (validateCurrentStep()) {
            if (currentStep < steps.length) {
                setCurrentStep(currentStep + 1)
            } else {
                handleSubmit()
            }
        } else {
            Alert.alert("Incomplete Information", "Please fill in all required fields before proceeding.")
        }
    }

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
        }
    }

    const handleSubmit = async () => {
        try {
            const res = await axios.post('http://192.168.0.179:8000/api/register', {
                email: registrationData.email,
                password: registrationData.password,
                password_confirmation: registrationData.confirmPassword,
                first_name: registrationData.firstName,
                last_name: registrationData.lastName,
                phone: registrationData.phone,
                date_of_birth: registrationData.dateOfBirth,
                address: registrationData.address,
                city: registrationData.city,
                state: registrationData.state,
                postal_code: registrationData.postalCode,
                country: registrationData.country,
                profile_image_url: null,
            });
            const token = res.data.token;
            await login(token);
            console.log("Registration Data:", registrationData)
            Alert.alert("Success", "Account created successfully!", [
                { text: "OK", onPress: () => navigation.navigate("Home") },
            ])

        } catch (error) {
            if (error.response) {
                console.log('Validation errors:', error.response.data.errors);
                Alert.alert('Validation failed', JSON.stringify(error.response.data.errors));
            } else {
                console.log('Error', error.message);
                Alert.alert('Error', error.message);
            }
        }
    }

    const renderCurrentStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <PersonalInfoStep
                        data={registrationData}
                        onUpdate={updateRegistrationData}
                    />
                )
            case 2:
                return <ContactInfoStep data={registrationData} onUpdate={updateRegistrationData} />
            case 3:
                return <SecurityStep data={registrationData} onUpdate={updateRegistrationData} />
            case 4:
                return <VerificationStep data={registrationData} onUpdate={updateRegistrationData} />
            case 5:
                return <AccountSetupStep data={registrationData} onUpdate={updateRegistrationData} />
            default:
                return null
        }
    }

    return (
        <View className="flex-1 bg-gray-50">
            <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />

            {/* Header */}
            <View className="bg-white pb-6 px-6 shadow-sm">
                <View className="text-center mb-6">
                    <Text className="text-lg font-semibold text-gray-900 text-center">Create Account</Text>
                    <View className="w-8" />
                </View>

                {/* Progress Indicator */}
                <View className="flex-row justify-between mb-4">
                    {steps.map((step, index) => (
                        <View key={step.id} className="flex-1 items-center">
                            <View
                                className={`w-8 h-8 rounded-full items-center justify-center mb-2 ${currentStep > step.id ? "bg-green-500" : currentStep === step.id ? "bg-blue-600" : "bg-gray-300"
                                    }`}
                            >
                                {currentStep > step.id ? (
                                    <Check size={16} color="white" />
                                ) : (
                                    <Text className={`text-sm font-semibold ${currentStep === step.id ? "text-white" : "text-gray-600"}`}>
                                        {step.id}
                                    </Text>
                                )}
                            </View>
                            {index < steps.length - 1 && (
                                <View
                                    className={`absolute top-4 left-1/2 w-full h-0.5 ${currentStep > step.id ? "bg-green-500" : "bg-gray-300"
                                        }`}
                                    style={{ marginLeft: 16 }}
                                />
                            )}
                        </View>
                    ))}
                </View>

                {/* Current Step Info */}
                <View className="items-center">
                    <Text className="text-xl font-bold text-gray-900 mb-1">{steps[currentStep - 1].title}</Text>
                    <Text className="text-gray-600 text-sm">{steps[currentStep - 1].subtitle}</Text>
                </View>
            </View>

            {/* Step Content */}
            <ScrollView className="flex-1 px-6 py-6" showsVerticalScrollIndicator={false}>
                {renderCurrentStep()}
            </ScrollView>

            {/* Navigation Buttons */}
            <View className="bg-white px-6 py-4 shadow-lg">
                <View className="flex-row justify-between">
                    <TouchableOpacity
                        onPress={handlePrevious}
                        disabled={currentStep === 1}
                        className={`flex-row items-center px-6 py-3 rounded-xl ${currentStep === 1 ? "bg-gray-100" : "bg-gray-200"
                            }`}
                    >
                        <ArrowLeft size={20} color={currentStep === 1 ? "#9ca3af" : "#374151"} />
                        <Text className={`ml-2 font-semibold ${currentStep === 1 ? "text-gray-400" : "text-gray-700"}`}>
                            Previous
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleNext} className="flex-row items-center px-6 py-3 bg-blue-600 rounded-xl">
                        <Text className="text-white font-semibold mr-2">
                            {currentStep === steps.length ? "Create Account" : "Next"}
                        </Text>
                        <ArrowRight size={20} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}
