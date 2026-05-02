package com.company.flowmodoro.features.session.helpers;

import org.springframework.stereotype.Component;

import com.company.flowmodoro.features.session.SessionModel;

@Component
public class SessionCalculator {

	private static final double RATIO = 0.2;

	public double calculateRatio(long focus, long rest) {
		if (rest == 0)
			return (double) focus;
		return (double) focus / rest;
	}

	public void calculateRest(SessionModel session) {
		if (session.getRatio() == null) {
			session.setRatio(RATIO);
		}
		double rest = session.getFocus() * session.getRatio();
		session.setRest(Math.round(rest));
	}

}
