import type React from "react";
import { useState } from "react";

import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

import HeaderSide from "../components/Main/HeaderSide";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import AppText from "../components/typo/AppText";
import MaterialIcons from "@react-native-vector-icons/material-icons";

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [open, setOpen] = useState(false);
  const height = useSharedValue(0);

  const toggle = () => {
    setOpen((prev) => !prev);
    height.value = withTiming(open ? 0 : 80, { duration: 300 }); // adjust height
  };

  const animatedStyle = useAnimatedStyle(() => ({
    height: height.value,
    opacity: withTiming(open ? 1 : 0),
  }));

  return (
    <View className="mb-4 rounded-xl bg-gray-100">
      <TouchableOpacity
        onPress={toggle}
        className="flex-row items-center justify-between p-4"
      >
        <AppText className="text-lg text-base font-semibold">
          {question}
        </AppText>
        <Text>
          {open ? "▼" : (
            <MaterialIcons
              name="chevron-right"
              color={"#215CE1"}
              size={20}
            />
          )}
        </Text>
      </TouchableOpacity>
      <Animated.View style={[animatedStyle]} className="overflow-hidden px-4">
        <AppText className="text-gray-600">{answer}</AppText>
      </Animated.View>
    </View>
  );
};

const FAQScreen: React.FC = () => {
  const faqs = [
    {
      question: "How do I reset my password?",
      answer:
        "To reset your password, go to the Login screen, click 'Forgot Password,' and follow the instructions.",
    },
    {
      question: "How do I add a new task?",
      answer:
        "Tap the '+' button on the home screen and fill in the task details.",
    },
    {
      question: "Why am I not receiving notifications?",
      answer:
        "Check your notification settings and ensure permissions are granted in your device settings.",
    },
    {
      question: "How do I contact support?",
      answer:
        "Check your notification settings and ensure permissions are granted in your device settings.",
    },
    {
      question: "What information is needed for a task??",
      answer:
        "Check your notification settings and ensure permissions are granted in your device settings.",
    },
  ];

  return (
    <ScrollView contentContainerClassName="min-h-full justify-start items-start bg-white flex-col">
      <HeaderSide heading="FAQs" isWithBack />
      <View className="w-full items-center mt-10">
        <Image
          source={require("../../assets/question_marks.png")}
          className="w-[200]"
        />
        <View className="flex-1 bg-white p-4 mt-10">
          {faqs.map((item, i) => (
            <FAQItem key={i} question={item.question} answer={item.answer} />
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default FAQScreen;
