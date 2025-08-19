'use client'

import { useEffect, useState } from "react"
import { zxcvbn, zxcvbnOptions } from "@zxcvbn-ts/core"
import { dictionary } from "@zxcvbn-ts/language-common"
import { Check, X } from "lucide-react"
import { Progress } from "@/components/ui/progress"

type PasswordStrengthMeterProps = {
  password: string
}

export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState({
    warning: "",
    suggestions: [] as string[],
  })

  useEffect(() => {
    const options = {
      dictionary: {
        ...dictionary,
      },
      useLevenshteinDistance: true,
    } as const

    zxcvbnOptions.setOptions(options)
    
    if (password) {
      const result = zxcvbn(password)
      setScore(result.score)
      setFeedback({
        warning: result.feedback.warning || "",
        suggestions: result.feedback.suggestions || [],
      })
    } else {
      setScore(0)
      setFeedback({
        warning: "",
        suggestions: [],
      })
    }
  }, [password])

  const getStrengthText = () => {
    switch (score) {
      case 0:
        return "Very Weak"
      case 1:
        return "Weak"
      case 2:
        return "Fair"
      case 3:
        return "Good"
      case 4:
        return "Strong"
      default:
        return "Very Weak"
    }
  }

  const getStrengthColor = () => {
    switch (score) {
      case 0:
        return "bg-red-500"
      case 1:
        return "bg-orange-500"
      case 2:
        return "bg-yellow-500"
      case 3:
        return "bg-blue-500"
      case 4:
        return "bg-green-500"
      default:
        return "bg-gray-200"
    }
  }

  const requirements = [
    { id: 1, text: "At least 8 characters", validate: (p: string) => p.length >= 8 },
    { id: 2, text: "Contains a number", validate: (p: string) => /[0-9]/.test(p) },
    { id: 3, text: "Contains a special character", validate: (p: string) => /[^A-Za-z0-9]/.test(p) },
    { id: 4, text: "Contains uppercase letter", validate: (p: string) => /[A-Z]/.test(p) },
    { id: 5, text: "Contains lowercase letter", validate: (p: string) => /[a-z]/.test(p) },
  ]

  return (
    <div className="mt-2 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Password Strength</span>
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {getStrengthText()}
        </span>
      </div>
      
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
        <div 
          className={`h-full ${getStrengthColor()} transition-all duration-300`}
          style={{ width: `${(score + 1) * 20}%` }}
        />
      </div>
      
      {password && (
        <div className="mt-3 space-y-2">
          <p className="text-xs text-muted-foreground">Password requirements:</p>
          <ul className="space-y-1 text-xs">
            {requirements.map((req) => {
              const isValid = req.validate(password)
              return (
                <li 
                  key={req.id} 
                  className={`flex items-center ${isValid ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}`}
                >
                  {isValid ? (
                    <Check className="mr-2 h-3 w-3" />
                  ) : (
                    <X className="mr-2 h-3 w-3" />
                  )}
                  {req.text}
                </li>
              )
            })}
          </ul>
          
          {feedback.warning && (
            <div className="mt-2 rounded-md bg-yellow-50 p-2 text-xs text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200">
              <p className="font-medium">Note: {feedback.warning}</p>
            </div>
          )}
          
          {feedback.suggestions.length > 0 && (
            <div className="mt-2 space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Suggestions:</p>
              <ul className="space-y-1 text-xs text-muted-foreground">
                {feedback.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
